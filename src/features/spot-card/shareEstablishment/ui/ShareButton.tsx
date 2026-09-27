import React from 'react';
import { ShareButton as ShareButtonUI } from '@shared/ui';

interface IShareButtonProps {
  onClick: () => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
}


export const ShareButton: React.FC<IShareButtonProps> = ({
                                                           onClick,
                                                           disabled = false,
                                                           size,
                                                           isLoading = false,
                                                         }) => {
  return (
      <ShareButtonUI
        onClick={onClick}
        disabled={disabled || isLoading}
        size={size}
      />
  );
};
