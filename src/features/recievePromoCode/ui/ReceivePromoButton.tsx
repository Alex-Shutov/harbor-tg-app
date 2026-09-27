import React from 'react';
import { Button } from '@shared/ui';

interface IReceivePromoButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  label?: string;
}


export const ReceivePromoButton: React.FC<IReceivePromoButtonProps> = ({
                                                                         onClick,
                                                                         isLoading = false,
                                                                         disabled = false,
                                                                         label = 'Получить Harbor Code',
                                                                       }) => {
  return (
    <Button
      type="secondary"
      onClick={onClick}
      disabled={disabled || isLoading}
      fullWidth
    >
      {isLoading ? 'Загрузка...' : label}
    </Button>
  );
};
