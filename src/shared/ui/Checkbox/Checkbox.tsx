import React from 'react';
import './checkbox.scss';
import { CheckIcon } from '@shared/ui';

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

export const Checkbox: React.FC<CheckboxProps> = ({
                                                    checked,
                                                    onChange,
                                                    className = '',
                                                    disabled = false,
  label='',
                                                  }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (!disabled) {
      onChange(e.target.checked);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <label
      className={`input-checkbox ${className} ${disabled ? 'input-checkbox--disabled' : ''}`}
      onClick={handleClick}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className="input-checkbox__native"
        disabled={disabled}
      />
      <span className={`input-checkbox__custom ${checked ? 'checked' : ''}`}>
        {checked ? (
          <CheckIcon />
        ) : (
          <div className="empty" />
        )}
      </span>
      <span className="checkbox-label">{label}</span>
    </label>
  );
};
