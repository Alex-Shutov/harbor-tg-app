import React from 'react';
import { IPromoCode, IToastState } from '@/entities/promocode/types';
import { handleSubmitSnackBar } from '@/utils/snackbar.ts';
import { BottomSheetWithImage, Button, Input } from '@/shared/ui';
import './promo-purchase-modal.scss';
import ToastMessage from '@components/ToastMessage';
import { EPageType } from '@shared/constants';
import { useNavigate } from 'react-router-dom';
import { formatDateWithOnlyDigits } from '@utils/date.ts';

interface IPromoPurchaseModalProps {
  promoCode: IPromoCode | null;
  isOpen: boolean;
  onClose: () => void;
  onPurchase: () => Promise<void>;
  isLoading: boolean;
  isPurchased?: boolean;
  toastState: IToastState;
  onHideToast: () => void;
}

export const PromoPurchaseModal: React.FC<IPromoPurchaseModalProps> = ({
                                                                         promoCode,
                                                                         isOpen,
                                                                         onClose,
                                                                         onPurchase,
                                                                         isLoading,
                                                                         isPurchased = false,
                                                                         toastState,
                                                                         onHideToast,
                                                                       }) => {
  const navigate = useNavigate();
  if (!promoCode) return null;


  const handleCopy = () => {
    navigator.clipboard.writeText(promoCode.code || '');
    handleSubmitSnackBar('Harbor Code скопирован!');
  };

  const handlePurchaseClick = async () => {
    try {
      await onPurchase();
    } catch (err) {
    }
  };

  const getObjectTypeLabel = (objectType: Exclude<EPageType, EPageType.TASK | EPageType.PROMOCODE | EPageType.GIVEAWAY>): string => {
    const labels: { [EPageType.ESTABLISHMENT]: string; [EPageType.EVENT]: string; [EPageType.LEISURE]: string } = {
      [EPageType.ESTABLISHMENT]: 'Заведение',
      [EPageType.EVENT]: 'Мероприятие',
      [EPageType.LEISURE]: 'Досуг',
    };
    return labels[objectType] || 'Объект';
  };

  const handleNavigateToObject = () => {
    if (promoCode.objectId && promoCode.objectType) {
      debugger
      navigate(`/${promoCode.objectType}/${promoCode.objectId}`);
    }
  };



  return (
    <>
      <BottomSheetWithImage
        isOpen={isOpen}
        onClose={onClose}
        mainImage={promoCode.img.url}
        imageAlt={promoCode.title}
        title={promoCode.title}
      >
        <div className="promo-purchase-modal">
          <p className="promo-purchase-modal__description">
            {promoCode.description}
          </p>
          <div className="promocode-card__validity">
            <span>Действует с
              <span className={'promocode-card__validity-value'}> {formatDateWithOnlyDigits(promoCode.startDate)} </span>
              по
              <span className={'promocode-card__validity-value'}> {formatDateWithOnlyDigits(promoCode.endDate)} </span>
            </span>
          </div>

          {!isPurchased && (
            <>
              {promoCode.objectTitle && promoCode.objectId && (
                <div className="promo-purchase-modal__section">
                  <span className="promo-purchase-modal__section-label">
                  {(promoCode.objectType === EPageType.ESTABLISHMENT ||
                    promoCode.objectType === EPageType.EVENT ||
                    promoCode.objectType === EPageType.LEISURE)
                    ? getObjectTypeLabel(promoCode.objectType)
                    : 'Объект'}:{' '}
                  </span>
                  <span onClick={handleNavigateToObject} className={'promo-purchase-modal__section-value link'}>{promoCode.objectTitle}</span>
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
                <span className={'promo-modal-profile__section-value'}>{promoCode.restrictionType === 'BY_USE' ? 'По количеству' : 'По выдаче'}</span>
              </div>

              {promoCode.restrictionType === 'BY_USE' && <div className="promo-modal-profile__section">
          <span className="promo-modal-profile__section-label">
            Количество оставшихся промокодов:
          </span>
                <span className={'promo-modal-profile__section-value'}>{promoCode.amount - promoCode.receivedCount}</span>
              </div>}

              {promoCode.restrictionType === 'UPON_RECEIPT' && <div className="promo-modal-profile__section">
          <span className="promo-modal-profile__section-label">
          Количество промокодов, которые можно применить:
          </span>
                <span className={'promo-modal-profile__section-value'}>{promoCode.amount - promoCode.appliedCount}</span>
              </div>}
              <div className="promo-purchase-modal__section">

                <span className="promo-purchase-modal__section-label">Стоимость:</span>
                <span className="promo-purchase-modal__section-value">
                  Бесплатно
                </span>
              </div>

              <Button
                type="primary"
                fullWidth
                onClick={handlePurchaseClick}
                disabled={isLoading}
              >
                {isLoading ? 'Обработка...' : 'Купить'}
              </Button>
            </>
          )}

          {isPurchased && (
            <div className="promo-purchase-modal__success">
              <Input
                name="promoCode"
                value={promoCode.code || ''}
                onChange={() => {}}
                type="text"
                readOnly
                onCopy={handleCopy}
                placeholder="Harbor Code"
              />

              <Button
                type="primary"
                fullWidth
                onClick={onClose}
              >
                Готово
              </Button>
            </div>
          )}

        </div>
      </BottomSheetWithImage>

      <ToastMessage
        className={'promo-purchase-toast'}
        isVisible={toastState.isVisible}
        title={toastState.title}
        description={toastState.description}
        icon={toastState.icon}
        type={toastState.type}
        showCloseButton={toastState.showCloseButton}
        duration={toastState.duration}
        onClose={onHideToast}
        onVisibilityChange={(visible) => !visible && onHideToast()}
      />
    </>
  );
};
