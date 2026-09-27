import React from 'react';
import './Item.scss';
import { PromoCode } from '../../promocodes.types.ts';
import { format, parseISO } from 'date-fns';
import { ru } from 'date-fns/locale';

interface PromoCodeItemProps {
  promoCode: PromoCode;
  onClick: () => void;
}
const formatPromoDate = (dateString: string) => {
  try {
    return format(parseISO(dateString), 'd MMMM yyyy', { locale: ru });
  } catch (e) {
    console.error('Error formatting date:', e);
    return dateString;
  }
};

const PromoCodeItem: React.FC<PromoCodeItemProps> = ({ promoCode, onClick }) => {
  const dateRange = `Действует с ${formatPromoDate(promoCode.startDate)} по ${formatPromoDate(promoCode.endDate)}`;
  return (<div className="promo-code-item" onClick={onClick}>
      <div className="promo-code-item__image">
        <img src={promoCode.imageUrl} alt={promoCode.title} />
      </div>
      <div className="promo-code-item__content">
        <div className="promo-code-item__header">
          <h3 className="promo-code-item__title">{promoCode.title}</h3>
        </div>
        <p className="promo-code-item__description">
          <span className="promo-code-item__discount">{promoCode.discount} </span>
          {promoCode.description}</p>
        <span className="promo-code-item__date">{dateRange}</span>
      </div>
    </div>
  );
};

export default PromoCodeItem;


