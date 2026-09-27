import React from 'react';
import { IPromoCode, EPromoCodeStatus, ERestrictionType } from '../types/promocode.types';
import { Card } from '@shared/ui';
import { formatDateWithOnlyDigits } from '@utils/date.ts';
import { isAfter, endOfDay } from 'date-fns';

interface IPromocodeCardProps {
  promo: IPromoCode;
  status: EPromoCodeStatus;
  onClick: () => void;
}

export const PromocodeCard: React.FC<IPromocodeCardProps> = ({
                                                               promo,
                                                               onClick,
                                                             }) => {
  const isDateExpired = isAfter(new Date(), endOfDay(new Date(promo.endDate)));
  const isCountExpired = promo.restrictionType === ERestrictionType.UPON_RECEIPT
    ? promo.amount <= promo.receivedCount
    : promo.amount <= promo.appliedCount;
  const isExpired = isDateExpired || isCountExpired;

  const description = `До ${formatDateWithOnlyDigits(promo.endDate)}`;

  return (
    <Card
      imgUrl={promo.img.url}
      imgAlt={promo.title}
      subtitle={promo.description}
      title={promo.title}
      description={description}
      isExpired={isExpired}
      onClick={onClick}
    />
  );
};
