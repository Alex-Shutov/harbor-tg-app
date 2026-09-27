import React from 'react';
import './share.button.scss';
import { SendIcon } from '@shared/ui/icons';

interface IShareButtonProps {
  onClick: () => void;
  disabled?: boolean;
  size?: 'small' | 'medium' | 'large';

}

export const ShareButton: React.FC<IShareButtonProps> = ({
                                                           onClick,
                                                           disabled = false,
                                                           size = 'medium',
                                                         }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      onClick();
    }
  };

  return (
    <button
      className={`share-button share-button--${size} ${disabled ? 'share-button--disabled' : ''}`}
      onClick={handleClick}
      disabled={disabled}
      aria-label="Поделиться"
    >
      <SendIcon/>
    </button>
  );
};
