import React from 'react';
import './filter-button.scss';
import { FilterIcon } from '@shared/ui';

export interface FilterIconButtonProps {
  onClick: () => void;
  hasActiveFilters?: boolean;
  className?: string;
  disabled?: boolean;
}

export const FilterButton: React.FC<FilterIconButtonProps> = ({
                                                                    onClick,
                                                                    hasActiveFilters = false,
                                                                    className = '',
                                                                    disabled = false,
                                                                  }) => {
  return (
    <button
      type="button"
      className={`filter-icon-button ${hasActiveFilters ? 'filter-icon-button--active' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      aria-label="Открыть фильтры"
    >
      <FilterIcon />
      {hasActiveFilters && <span className="filter-icon-button__badge" />}
    </button>
  );
};
