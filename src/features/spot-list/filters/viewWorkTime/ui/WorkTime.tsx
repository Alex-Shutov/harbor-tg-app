import React from 'react';
import './work-time.scss';
import { IWorkTimeOption } from '@/entities/lib';
import { Chip } from '@shared/ui';

interface WorkTimeProps {
  value: IWorkTimeOption;
  onChange: (value: IWorkTimeOption) => void;
}

export const WorkTime: React.FC<WorkTimeProps> = ({ value, onChange }) => {
  const handleOptionClick = (option: IWorkTimeOption) => {
    if (value === option) {
      onChange(null);
    } else {
      onChange(option);
    }
  };

  return (
    <div className="work-time">
      <h3 className="work-time__title">Время работы</h3>
      <div className="work-time__options">
        <Chip
          isActive={value === 'Круглосуточно'}
          onClick={() => handleOptionClick('Круглосуточно')}
        >
          Круглосуточно
        </Chip>
        <Chip
          isActive={value === 'Открыто'}
          onClick={() => handleOptionClick('Открыто')}
        >
          Открыто
        </Chip>
      </div>
    </div>
  );
};
