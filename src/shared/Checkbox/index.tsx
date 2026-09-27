import React from 'react';
import './checkbox.scss';

interface InputCheckboxProps {
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

const InputCheckbox: React.FC<InputCheckboxProps> = ({
                                                       checked,
                                                       onChange,
                                                       className = ''
                                                     }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <label
      className={`input-checkbox ${className}`}
      onClick={handleClick} // Добавляем обработчик клика на весь label
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => {
          e.stopPropagation();
          onChange(e);
        }}
        className="input-checkbox__native"
      />
      <span className={`input-checkbox__custom ${checked ? 'checked' : ''}`}>
        {checked ? (
          <svg viewBox={'-4 -1 20 10'} fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1 5L4.5 8.5L11 1"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : <div className={'empty'}></div>}
      </span>
    </label>
  );
};

export default InputCheckbox;