import React from 'react';
import { UrbanWhiteOrangeIcon } from '@shared/ui';
import './shop-card.scss';

interface IShopCardProps {
  imgUrl: string;
  imgAlt?: string;
  title: string;
  isExpired?: boolean;
  onClick?: () => void;
  price: string;
  isUrbanBox?: boolean;
  showPriceInRubles?: boolean;
  originalPrice?: number;
  remainingCount?: number;
  isSoldOut?: boolean;
}

const RemainingBadge: React.FC<{ isSoldOut: boolean; remainingCount: number }> = ({
  isSoldOut,
  remainingCount,
}) => {
  return (
    <div className={`shop-card__remaining-badge ${isSoldOut ? 'shop-card__remaining-badge--sold-out' : 'shop-card__remaining-badge--remaining'}`}>
      {!isSoldOut ? `Осталось ${remainingCount}` : 'Закончилось'}
    </div>
  );
};

export const ShopCard: React.FC<IShopCardProps> = ({
  imgUrl,
  imgAlt = 'Card image',
  title,
  isExpired = false,
  onClick,
  price,
  showPriceInRubles = false,
  originalPrice,
  remainingCount,
  isSoldOut = false,
}) => {
  const hasDiscount = originalPrice !== undefined && originalPrice > 0;
  
  return (
    <div
      className={`shop-card ${isExpired ? 'shop-card--expired' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="shop-card__image-wrapper">
        <img src={imgUrl} alt={imgAlt} className="shop-card__image" />
        {remainingCount !== undefined && (
          <RemainingBadge isSoldOut={isSoldOut} remainingCount={remainingCount} />
        )}
      </div>

      <div className="shop-card__price">
        <div className="shop-card__pricing">
          <span className={`shop-card__price-value`}>{price}</span>
          {hasDiscount && (
            <span className="shop-card__original-price">{originalPrice} ₽</span>
          )}
          {!showPriceInRubles && <UrbanWhiteOrangeIcon viewBox={'-5 -2 28 28'} size={20} />}
        </div>
      </div>

      <div className="shop-card__title-wrapper">
        <h3 className="shop-card__title">{title}</h3>
      </div>
    </div>
  );
};


