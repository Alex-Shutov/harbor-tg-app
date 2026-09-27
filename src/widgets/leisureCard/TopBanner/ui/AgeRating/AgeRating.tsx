import React from 'react';
import './AgeRating.scss';
import { EAgeRating } from '@shared/constants';
import { AgeRating } from '@shared/ui/icons/variants/ageRating.tsx';

interface IAverageBillProps {
  ageRating: EAgeRating;
}

export const AgeRatingComponent: React.FC<IAverageBillProps> = ({ ageRating }) => {

  return (
    <div className="average-bill">
      <div className="average-bill__icon">
        <AgeRating />
      </div>
      <div className="average-bill__content">
        <span className="average-bill__amount">{EAgeRating[ageRating]}+</span>
        <span className="average-bill__label">Средний чек</span>
      </div>
    </div>
  );
};
