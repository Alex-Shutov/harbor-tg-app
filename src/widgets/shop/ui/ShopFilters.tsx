import React from 'react';
import { Chip } from '@shared/ui';
import { EStoreItemType } from '@/entities/shop/types';
import './shop-filters.scss';

export type ShopFilterType = 'all' | EStoreItemType;

interface IShopFiltersProps {
  selectedFilter: ShopFilterType;
  onFilterChange: (filter: ShopFilterType) => void;
}

const FILTERS: { key: ShopFilterType; label: string }[] = [
  { key: 'all', label: 'Все' },
  { key: EStoreItemType.PROMO_CODE, label: 'Harbor Codes' },
  { key: EStoreItemType.URBAN_BOX, label: 'наборы' },
  { key: EStoreItemType.PRODUCT, label: 'Товары' },
];

export const ShopFilters: React.FC<IShopFiltersProps> = ({
  selectedFilter,
  onFilterChange,
}) => {
  return (
    <div className="shop-filters">
      <div className="shop-filters__content">
        {FILTERS.map((filter) => (
          <Chip
            key={filter.key}
            isActive={selectedFilter === filter.key}
            onClick={() => onFilterChange(filter.key)}
          >
            {filter.label}
          </Chip>
        ))}
      </div>
    </div>
  );
};


