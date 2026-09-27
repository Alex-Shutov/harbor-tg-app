import React from 'react';
import { Chip } from '@shared/ui';
import './shop-status-filter.scss';

export type ShopStatusFilterType = 'active' | 'completed';

interface IShopStatusFilterProps {
  selectedStatus: ShopStatusFilterType;
  onStatusChange: (status: ShopStatusFilterType) => void;
}

const STATUSES: { key: ShopStatusFilterType; label: string }[] = [
  { key: 'active', label: 'Активные' },
  { key: 'completed', label: 'Завершённые' },
];

export const ShopStatusFilter: React.FC<IShopStatusFilterProps> = ({
  selectedStatus,
  onStatusChange,
}) => {
  return (
    <div className="shop-status-filter">
      <div className="shop-status-filter__content">
        {STATUSES.map((status) => (
          <Chip
            key={status.key}
            isActive={selectedStatus === status.key}
            onClick={() => onStatusChange(status.key)}
          >
            {status.label}
          </Chip>
        ))}
      </div>
    </div>
  );
};


