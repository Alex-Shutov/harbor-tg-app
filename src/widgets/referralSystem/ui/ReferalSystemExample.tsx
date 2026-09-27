import React, { useState } from 'react';
import { ReferalSystemWidget, ReferalModal } from '../ui';
import { useGetReferralSystemInfoQuery } from '@/entities/referral';

/**
 * Пример использования компонентов реферальной системы
 * 
 * Использование:
 * <ReferalSystemExample />
 */
export const ReferalSystemExample: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: referralData, isLoading } = useGetReferralSystemInfoQuery();

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading || !referralData) {
    return null; // или можно показать скелетон
  }

  return (
    <>
      <ReferalSystemWidget
        onClick={handleOpenModal}
      />
      <ReferalModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        referralData={referralData}
      />
    </>
  );
};


