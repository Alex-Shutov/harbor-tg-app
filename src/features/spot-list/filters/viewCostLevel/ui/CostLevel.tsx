import React from 'react';
import { ECostLevel } from '@shared/constants';
import { Chip } from '@shared/ui';
interface IProps{
  options:{   value: ECostLevel,   label: string }[]
  value:ECostLevel
  onChange: ( value:ECostLevel) => void
}

export const CostLevel:React.FC<IProps> = ({options,value,onChange}) => {
  return (
    <div className="filters-modal__section">
      <h3 className="filters-modal__section-title">Средний чек</h3>
      <div className="filters-modal__options">
        {options.map((option) => (
          <Chip
            isActive={option.value === value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </Chip>
        ))}
      </div>
    </div>

  );
};

