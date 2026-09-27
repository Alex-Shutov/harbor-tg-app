import React from 'react';
import { Button } from '@shared/ui';
import './review-button.scss';

interface ReviewButtonProps {
  onClick: () => void;
  label?: string;
  disabled?: boolean;
}

export const ReviewButton: React.FC<ReviewButtonProps> = ({
                                                            onClick,
                                                            label = 'Смотреть',
                                                            disabled = false,
                                                          }) => {
  return (
    <Button
      type={'secondary'}
      className="review-button"
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </Button>
  );
};
