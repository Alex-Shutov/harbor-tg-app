import { useState, useCallback, useMemo } from 'react';
import { EPromoCodeStatus, IPromoCode, IPromoCodeResponse } from '@/entities/promocode/types';

interface UsePromocodesPageStateProps {
  promoCodesResponse: IPromoCodeResponse | undefined;
}

export const usePromocodesState = ({
                                         promoCodesResponse,
                                       }: UsePromocodesPageStateProps) => {
  const [selectedStatus, setSelectedStatus] = useState<EPromoCodeStatus | null>(null);

  const { active = [], completed = [], used = [] } = promoCodesResponse || {};

  const allPromoCodes: IPromoCode[] = useMemo(
    () => [...active, ...completed, ...used],
    [active, completed, used]
  );

  const filteredPromoCodes = useMemo(() => {
    if (!selectedStatus) return allPromoCodes;

    switch (selectedStatus) {
      case EPromoCodeStatus.ACTIVE:
        return active;
      case EPromoCodeStatus.COMPLETED:
        return completed;
      case EPromoCodeStatus.USED:
        return used;
      default:
        return allPromoCodes;
    }
  }, [selectedStatus, active, completed, used, allPromoCodes]);

  const handleStatusChange = useCallback((status: EPromoCodeStatus | null) => {
    setSelectedStatus(status);
  }, []);

  return {
    selectedStatus,
    filteredPromoCodes,
    handleStatusChange,
    allPromoCodes,
  };
};
