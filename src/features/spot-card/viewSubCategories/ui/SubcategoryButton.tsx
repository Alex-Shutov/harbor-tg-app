import React from 'react';
import './button.scss';
import { IEstablishmentCategory, IEstablishmentInnerCategory } from '@shared/types';

interface CategoryButtonProps {
  category: IEstablishmentCategory | IEstablishmentInnerCategory;
  isActive?: boolean;
  canSelect?: boolean;
  onClick?: () => void;
}

export const SubcategoryButton: React.FC<CategoryButtonProps> = ({
                                                                category,
                                                                isActive = false,
                                                                canSelect = false,
                                                                onClick,
                                                              }) => {
  return (
    <div
      className={`subcategory-button ${isActive ? 'active' : ''}`}
      onClick={onClick}
      style={{
        cursor: canSelect ? 'pointer' : 'default',
        opacity: canSelect ? 1 : 0.8,
      }}
    >
      {category.title}
    </div>
  );
};
