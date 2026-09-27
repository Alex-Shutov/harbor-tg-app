import React from 'react';
import { Chip } from '@shared/ui';
import { EPageType } from '@shared/constants/types.constants';
import './promo-code-type-filter.scss';


interface IPromoCodeTypeFilterProps {
  selectedType: EPageType;
  onTypeChange: (type: EPageType) => void;
}

const TYPES: { key: EPageType; label: string }[] = [
  { key: EPageType.ESTABLISHMENT, label: 'Заведения' },
  { key: EPageType.EVENT, label: 'Мероприятия' },
  { key: EPageType.LEISURE, label: 'Досуг' },
];

export const PromoCodeTypeFilter: React.FC<IPromoCodeTypeFilterProps> = ({
                                                                           selectedType,
                                                                           onTypeChange,
                                                                         }) => {
  return (
    <div className="promo-code-type-filter">
      <div className="promo-code-type-filter__content">
        {TYPES.map((type) => (
          <Chip
            key={type.key}
            isActive={selectedType === type.key}
            onClick={() => onTypeChange(type.key)}
          >
            {type.label}
          </Chip>
        ))}
      </div>
    </div>
  );
};
