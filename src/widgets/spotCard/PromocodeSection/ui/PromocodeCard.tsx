import React from 'react';
import { Title, Button, Image } from '@shared/ui';
import './promocode-card.scss';
import { IPromoCode, EPromoType } from '@/entities/promocode/types';
import { formatDateWithOnlyDigits } from '@utils/date.ts';

interface IPromocodeCardProps {
  promoCode: IPromoCode;
  onActionClick: () => void;
  isLoading?: boolean;
  buttonDisabled?: boolean;
}

export const PromocodeCard: React.FC<IPromocodeCardProps> = ({
                                                               promoCode,
                                                               onActionClick,
                                                               isLoading = false,
                                                               buttonDisabled=false,
                                                             }) => {
  const isPurchased = promoCode.receivedCount > 0;
  const isPaid = promoCode.type === EPromoType.PAID;

  const getButtonLabel = (): string => {
    if (isPaid && !isPurchased) {
      return 'Купить harbor code';
    }
    return 'Получить промокод';
  };


  return (
    <div className="promocode-card" onClick={onActionClick}>
      <div className="promocode-card__content">
        {promoCode.img?.url && (
          <div className="promocode-card__image">
            <Image
              src={promoCode.img.url}
              alt={promoCode.title}
              className="promocode-card__img"
            />
          </div>
        )}
        <div className="promocode-card__text">
          <Title className="promocode-card__title">{promoCode.title}</Title>
          
          <p className="promocode-card__description">
            {promoCode.description}
          </p>

          <div className="promocode-card__validity">
            <span>Действует с
              <span className={'promocode-card__validity-value'}> {formatDateWithOnlyDigits(promoCode.startDate)} </span>
              по
              <span className={'promocode-card__validity-value'}> {formatDateWithOnlyDigits(promoCode.endDate)} </span>
            </span>
          </div>

        </div>


      </div>

      {!buttonDisabled && <Button
        type="secondary"
        disabled={isLoading}
        fullWidth
        className="promocode-card__button"
      >
        {isLoading ? 'Загрузка...' : getButtonLabel()}
      </Button>}
    </div>
  );
};
