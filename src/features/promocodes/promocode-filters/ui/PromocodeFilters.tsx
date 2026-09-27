import React from 'react';
import { Chip } from '@shared/ui';
import './promo-code-filters.scss';
import { EPromoCodeStatus, IPromoCodeResponse } from '@/entities/promocode/types';

interface IPromoCodeFiltersProps {
  promoCodesResponse: IPromoCodeResponse | undefined;
  selectedStatus: EPromoCodeStatus | null;
  onStatusChange: (status: EPromoCodeStatus | null) => void;
}

export const PromoCodeFilters: React.FC<IPromoCodeFiltersProps> = ({
                                                                     promoCodesResponse,
                                                                     selectedStatus,
                                                                     onStatusChange,
                                                                   }) => {
  const { active = [], completed = [], used = [] } = promoCodesResponse || {};

  const statusFilters = [
    { id: EPromoCodeStatus.ACTIVE, title: 'Активные', codes: active },
    { id: EPromoCodeStatus.COMPLETED, title: 'Завершенные', codes: completed },
    { id: EPromoCodeStatus.USED, title: 'Примененные', codes: used },
  ];

  return (
    <div className="promo-code-filters">
      <div className="promo-code-filters__container">
        {statusFilters.map((filter) => (
          <Chip
            isActive={selectedStatus === filter.id}
            onClick={() =>
              onStatusChange(selectedStatus === filter.id ? null : filter.id)
            }
          >
            {filter.title}

          </Chip>
        ))}
      </div>
    </div>
  );
};
