import React, { MouseEventHandler } from 'react';
import './button.scss';

type ButtonType = 'primary' | 'secondary' | 'gradient' | 'outline';

interface IButtonProps {
  type: ButtonType;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  children?: React.ReactNode;
  className?: string;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

export const Button: React.FC<IButtonProps> = ({
                                                 type,
                                                 onClick,
                                                 children,
                                                 disabled = false,
                                                 className = '',
                                                 size = 'medium',
                                                 fullWidth = false,
                                               }) => {
  return (
    <button
      className={`
        button 
        button--${type} 
        button--${size}
        ${disabled ? 'button--disabled' : ''} 
        ${fullWidth ? 'button--full-width' : ''}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
