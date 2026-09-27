import React from 'react';
import './chip.scss';

export interface ChipProps {
  children: React.ReactNode;
  isActive?: boolean;
  onClick: () => void;
  className?: string;
  disabled?: boolean;
}

export const Chip: React.FC<ChipProps> = ({
                                                            children,
                                                            isActive = false,
                                                            onClick,
                                                            className = '',
                                                            disabled = false,
                                                          }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) {
      onClick();
    }
  };

  return (
    <button
      type="button"
      className={`chip ${isActive ? 'chip--active' : ''} ${className}`}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
