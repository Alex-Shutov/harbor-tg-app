import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './promo-code-modal.scss';
import { IPromoCode } from '@/entities/promocode/types';
import { handleSubmitSnackBar } from '@utils/snackbar.ts';
import { BottomSheetWithImage, Button, Input } from '@shared/ui';
import { EPageType } from '@shared/constants';
import { formatDateWithOnlyDigits } from '@utils/date.ts';
import { useShare } from '@/features/spot-card/shareEstablishment';


type PromoCodeModalProfileProps =
  | {
  context: 'profile';
  promoCode: IPromoCode | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  onUsePromoCode: (code: string) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
  objectName: string;
  objectId: number;
  issuedAt?: string; // Дата выдачи промокода (сохраняется на фронте)
}
  | {
  context: 'object';
  promoCode: IPromoCode | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  onUsePromoCode: (code: string) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
  objectName?: never;
  objectId?: never;
  issuedAt?: string; // Дата выдачи промокода (сохраняется на фронте)
}
  | {
  // Режим покупки (для магазина)
  context?: never;
  promoCode: IPromoCode | null;
  isOpen: boolean;
  onClose: () => void;
  onApply?: () => void;
  onUsePromoCode?: (code: string) => Promise<void>;
  isLoading: boolean;
  error?: string | null;
  objectName?: never;
  objectId?: never;
  issuedAt?: never;
};

const getObjectTypeLabel = (objectType: Exclude<EPageType, EPageType.TASK | EPageType.PROMOCODE | EPageType.GIVEAWAY>): string => {
  const labels: { [EPageType.ESTABLISHMENT]: string; [EPageType.EVENT]: string; [EPageType.LEISURE]: string } = {
    [EPageType.ESTABLISHMENT]: 'Заведение',
    [EPageType.EVENT]: 'Мероприятие',
    [EPageType.LEISURE]: 'Досуг',
  };

  return labels[objectType] || 'Объект';
};

export const PromoCodeModal: React.FC<PromoCodeModalProfileProps> = ({
                                                                       promoCode,
                                                                       isOpen,
                                                                       onClose,
                                                                       onUsePromoCode: _onUsePromoCode,
                                                                       isLoading,
                                                                       onApply,
                                                                       error: _error,
                                                                       context,

                                                                     }) => {
  const navigate = useNavigate();
  const [wasAppliedInSession, setWasAppliedInSession] = useState(false);
  const [wasPurchasedInSession, setWasPurchasedInSession] = useState(false);
  const [_, setIsCodeRevealed] = useState(() => {
    return promoCode?.useOrGetType === 'CAN_USE' && !!promoCode?.code;
  });

  const { handleShare } = useShare({
    title: 'ищи в приложении!',
    text: 'Посмотри, что я нашел!',
    pageType: EPageType.PROMOCODE,
    entityId: promoCode?.id,
  });

  useEffect(() => {
    if (!isOpen) {
      setWasAppliedInSession(false);
      setWasPurchasedInSession(false);
      if (promoCode?.useOrGetType !== 'CAN_USE' || !promoCode?.code) {
        setIsCodeRevealed(false);
      }
    } else {
      if (promoCode?.useOrGetType === 'CAN_USE' && promoCode?.code) {
        setIsCodeRevealed(true);
      }
    }
  }, [isOpen, promoCode?.useOrGetType, promoCode?.code]);

  if (!promoCode) return null;


  const shouldShowApplyButton = () => {
    debugger
    if (promoCode.isExpired) return false;
     if (wasAppliedInSession) return false;


    else if (promoCode.useDateTime) return false


    else if (promoCode.useOrGetType === 'CAN_USE' ) {
      return !promoCode.useDateTime
    }
     else if (promoCode.useOrGetType==='CAN_GET' || promoCode.receivedDateTime) return true;

    else if (wasPurchasedInSession) return true;

    return false;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(promoCode.code || '');
    handleSubmitSnackBar('Harbor Code скопирован!');
  };

  const handleNavigateToObject = () => {
    if (promoCode.objectId && promoCode.objectType) {
      navigate(`/${promoCode.objectType}/${promoCode.objectId}`);
    }
  };


  const handleApplyClick = async () => {
    debugger
    if (onApply) {
      try {
        await onApply();
        setWasPurchasedInSession(true);

      } catch (err) {
        setWasPurchasedInSession(false);

      }
    };
  }

  const getButtonLabel = (promoCode:IPromoCode) =>{
    if(isLoading){
      if (promoCode.useOrGetType === 'CAN_GET'){
        return promoCode.type === 'FREE' ? 'Получение...' : 'Покупка...'
      }
      else{
        return 'Применение...'
      }
    }
    else {
      if (promoCode.useOrGetType === 'CAN_GET'){
        return promoCode.type === 'FREE' ? 'Получить harbor code' : 'Купить harbor code'
      }
      else{
        return 'Применить harbor code'
      }
    }
  }

  return (
    <>
    <BottomSheetWithImage
      isOpen={isOpen}
      onClose={onClose}
      mainImage={promoCode?.img?.url??''}
      imageAlt={promoCode.title}
      title={promoCode.title}
      onShare={handleShare}
    >
      <div className="promo-modal-profile">
        <p className="promo-modal-profile__description">
          {promoCode.description}
        </p>

        <div className="promocode-card__validity">
            <span>Действует с
              <span className={'promocode-card__validity-value'}> {formatDateWithOnlyDigits(promoCode.startDate)} </span>
              по
              <span className={'promocode-card__validity-value'}> {formatDateWithOnlyDigits(promoCode.endDate)} </span>
            </span>
        </div>

        {((context === 'profile' ) && promoCode.objectTitle && promoCode.objectId) && (
          <div className="promo-modal-profile__section">
            <span className="promo-modal-profile__section-label">
              {(promoCode.objectType === EPageType.ESTABLISHMENT || 
                promoCode.objectType === EPageType.EVENT || 
                promoCode.objectType === EPageType.LEISURE) 
                ? getObjectTypeLabel(promoCode.objectType) 
                : 'Объект'}:{' '}
            </span>
            <span
              onClick={ handleNavigateToObject }
              className="promo-modal-profile__section-value promo-modal-profile__section-value--link"
            >
              {promoCode.objectTitle}
            </span>
          </div>
        )}
        <div className="promo-modal-profile__section">
          <span className="promo-modal-profile__section-label">
            Возможность переиспользования:
          </span>
          <span className={'promo-modal-profile__section-value'}>{promoCode.allowReuse ? 'Да' : 'Нет'}</span>
        </div>

        <div className="promo-modal-profile__section">
          <span className="promo-modal-profile__section-label">
            Тип промокода:
          </span>
          <span className={'promo-modal-profile__section-value'}>{promoCode.restrictionType === 'BY_USE' ? 'По применению' : 'По выдаче'}</span>
        </div>

        {promoCode.restrictionType === 'BY_USE' && <div className="promo-modal-profile__section">
          <span className="promo-modal-profile__section-label">
            Количество оставшихся промокодов:
          </span>
          <span className={'promo-modal-profile__section-value'}>{promoCode.amount - promoCode.appliedCount}</span>
        </div>}

        {promoCode.restrictionType === 'UPON_RECEIPT' && <div className="promo-modal-profile__section">
          <span className="promo-modal-profile__section-label">
          Доступно для применения:
          </span>
          <span className={'promo-modal-profile__section-value'}>{promoCode.amount - promoCode.receivedCount}</span>
        </div>}

        <div className="promo-modal-profile__section">
          <span className="promo-modal-profile__section-label">Стоимость:</span>
          <span className="promo-modal-profile__section-value">
            Бесплатно
          </span>
        </div>

        { (
          <Input
            name="promoCode"
            value={promoCode.code || ''}
            onChange={() => {}}
            type={ ( promoCode.useDateTime ) ? "text" : "password"}
            readOnly
            onCopy={ (promoCode.useDateTime) ? handleCopy : undefined}
            placeholder="Harbor Code"
          />
        )}



        {shouldShowApplyButton() && (
          <Button
            type="primary"
            fullWidth
            onClick={()=>handleApplyClick()}
            // disabled={isLoading}
          >
            {getButtonLabel(promoCode)}
          </Button>
        )}




      </div>
    </BottomSheetWithImage>
    </>
  );
};
