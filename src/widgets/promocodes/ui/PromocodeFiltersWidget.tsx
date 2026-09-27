import React from 'react';
import { PromoCodeFilters } from '@/features/promocodes/promocode-filters';
import { EPromoCodeStatus, IPromoCodeResponse } from '@/entities/promocode/types';

interface IPromoCodeFiltersWidgetProps {
  promoCodesResponse: IPromoCodeResponse | undefined;
  selectedStatus: EPromoCodeStatus | null;
  onStatusChange: (status: EPromoCodeStatus | null) => void;
}

export const PromoCodeFiltersWidget: React.FC<IPromoCodeFiltersWidgetProps> = ({
                                                                                 promoCodesResponse,
                                                                                 selectedStatus,
                                                                                 onStatusChange,
                                                                               }) => {
  return (
    <PromoCodeFilters
      promoCodesResponse={promoCodesResponse}
      selectedStatus={selectedStatus}
      onStatusChange={onStatusChange}
    />
  );
};
