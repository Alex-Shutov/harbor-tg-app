import React, { useState, useRef, useEffect } from 'react';
import './filters-section.scss';
import { IWorkTimeOption } from '@/entities/lib';
import { useFiltersEstablishments } from '@/entities/establishments/model/store/useFiltersEstablishmentStore.ts';
import { Dropdown, FilterButton } from '@shared/ui';
import { ECostLevel } from '@shared/constants';

interface FiltersSectionProps {
  onFiltersClick: () => void;
  onAverageCheckClick?: () => void;
}


const workTimeOptions: Array<{ value: IWorkTimeOption; label: string }> = [
  { value: 'Круглосуточно', label: 'Круглосуточно' },
  { value: 'Открыто', label: 'Открыто' },
];

const costLevelOptions: Array<{ value: ECostLevel | null; label: string }> = [
  { value: ECostLevel.ONE, label: '₽' },
  { value: ECostLevel.TWO, label: '₽₽' },
  { value: ECostLevel.THREE, label: '₽₽₽' },
  { value: ECostLevel.FOUR, label: '₽₽₽₽' },
  { value: ECostLevel.FIVE, label: '₽₽₽₽₽' },
];

export const FiltersSection: React.FC<FiltersSectionProps> = ({ onFiltersClick }) => {
  const { workTime, costLevel, hasActiveFilters, updateWorkTime, updateCostLevel } = useFiltersEstablishments();
  const [isWorkTimeOpen, setIsWorkTimeOpen] = useState(false);
  const [_, setIsCostLevelOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement|null>();

  // Закрытие dropdown при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsWorkTimeOpen(false);
      }
    };

    if (isWorkTimeOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isWorkTimeOpen]);

  const handleWorkTimeChange = (newValue: IWorkTimeOption) => {
    updateWorkTime(workTime === newValue ? null : newValue);
    setIsWorkTimeOpen(false);
  };

  const handleCostLevelChange = (newValue: ECostLevel | null) => {
    updateCostLevel(costLevel === newValue && newValue !== null ? null : newValue);
    setIsCostLevelOpen(false);
  };

  return (
    <div className="filters-section">
      {/* Кнопка открытия модалки фильтров */}
      {/*<button*/}
      {/*  type="button"*/}
      {/*  className={`filters-section__icon-button ${hasActiveFilters ? 'filters-section__icon-button--active' : ''}`}*/}
      {/*  onClick={onFiltersClick}*/}
      {/*  aria-label="Открыть фильтры"*/}
      {/*>*/}
      {/*  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
      {/*    <path d="M3 7H21M6 12H18M9 17H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />*/}
      {/*  </svg>*/}
      {/*  {hasActiveFilters && <span className="filters-section__badge" />}*/}
      {/*</button>*/}
      <FilterButton onClick={onFiltersClick} hasActiveFilters={hasActiveFilters}/>

      {/* Dropdown для выбора времени работы */}
      <Dropdown<Exclude<IWorkTimeOption,null>>
        options={workTimeOptions}
        value={workTime}
        onChange={handleWorkTimeChange}
        placeholder="График работы"
      />

      <Dropdown<ECostLevel>
        options={costLevelOptions}
        value={costLevel}
        onChange={handleCostLevelChange}
        placeholder="Средний чек"
      />
    </div>
  );
};
