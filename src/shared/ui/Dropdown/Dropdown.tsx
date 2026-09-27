import React, { useState, useRef, useEffect } from 'react';
import './dropdown.scss';

export interface DropdownOption<T = string> {
  value: T;
  label: string;
}

export interface DropdownProps<T extends string> {
  options: DropdownOption<T|null>[];
  value: T | null;
  onChange: (value: T | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export const Dropdown = <T extends string >({
                                             options,
                                             value,
                                             onChange,
                                             placeholder = 'Выберите',
                                             className = '',
                                             disabled = false,
                                           }: DropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleOptionClick = (optionValue: T|null) => {
    // Если выбрана та же опция - снимаем выбор
    if (value === optionValue) {
      onChange(null);
    } else {
      onChange(optionValue);
    }
    setIsOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className={`dropdown ${isOpen ? 'dropdown--open' : ''} ${disabled ? 'dropdown--disabled' : ''} ${className}`}
    >
      <button
        type="button"
        className={`dropdown__trigger ${value ? 'dropdown__trigger--has-value' : ''}`}
        onClick={handleToggle}
        disabled={disabled}
      >
        <span className="dropdown__trigger-text">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          className="dropdown__trigger-icon"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="dropdown__menu">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`dropdown__option ${value === option.value ? 'dropdown__option--selected' : ''}`}
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
