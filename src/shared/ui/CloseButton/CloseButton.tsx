import React from 'react';
import classNames from 'classnames';

import './close-button.scss';

export interface CloseButtonProps {
  onClick: () => void;
  className?: string;
  'aria-label'?: string;
  size?: 'small' | 'medium' | 'large';
}

export const CloseButton: React.FC<CloseButtonProps> = ({
                                                          onClick,
                                                          className,
                                                          'aria-label': ariaLabel = 'Закрыть',
                                                          size = 'medium',
                                                        }) => {
  return (
    <button
      type="button"
      className={classNames('close-button', `close-button--${size}`, className)}
      onClick={onClick}
      aria-label={ariaLabel}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 18.5L18 6.5" stroke="#3C3C43" stroke-linecap="round" stroke-width="3" stroke-linejoin="round"/>
        <path d="M18 18.5L6 6.5" stroke="#3C3C43" stroke-linecap="round" stroke-width="3" stroke-linejoin="round"/>
      </svg>

    </button>
  );
};

export default CloseButton;

























