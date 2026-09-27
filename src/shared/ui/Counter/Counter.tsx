import React from 'react';
import './counter.scss';

interface ICounterProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  className?: string;
}

export const Counter: React.FC<ICounterProps> = ({
  value,
  min = 0,
  max,
  onChange,
  disabled = false,
  className = '',
}) => {
  const handleDecrement = () => {
    if (!disabled && value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (!disabled && (!max || value < max)) {
      onChange(value + 1);
    }
  };

  return (
    <div className={`counter ${className}`}>
      <button
        className="counter__button counter__button--decrement"
        onClick={handleDecrement}
        disabled={disabled || value <= min}
        type="button"
      >
        -
      </button>
      <span className="counter__value">{value}</span>
      <button
        className="counter__button counter__button--increment"
        onClick={handleIncrement}
        disabled={disabled || (max !== undefined && value >= max)}
        type="button"
      >
        +
      </button>
    </div>
  );
};





