import React from 'react';
import { Button } from '@shared/ui';

interface IOpenMenuButtonProps {
  onClick: () => void;
  disabled?: boolean;
  label?: string;
}

export const OpenMenuButton: React.FC<IOpenMenuButtonProps> = ({
                                                                 onClick,
                                                                 disabled = false,
                                                                 label = 'Открыть меню',
                                                               }) => {
  return (
    <Button
      type="secondary"
  onClick={onClick}
  disabled={disabled}
  fullWidth
  >
  {label}
  </Button>
);
};
