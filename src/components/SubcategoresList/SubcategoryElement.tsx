import React from 'react';
import { Category } from '../../pages/Establishments/components/CategoriesBar/categroies.atoms.ts';

interface SubcategoryElementProps {
  subcategory: Omit<Category, 'innerCategoriesTitle'>,
  selectedSubcategory?: number[] ,
  canSelect?: boolean,
  handleSelectSubcategory?: (id: number) => void,
  key?: any
}

const SubcategoryElement: React.FC<SubcategoryElementProps> = ({
                                                                 subcategory,
                                                                 selectedSubcategory,
                                                                 canSelect = true,
                                                                 handleSelectSubcategory,
                                                               }) => {
  const isActive = selectedSubcategory?.includes(subcategory.id);

  return (
    <div
      className={`subcategory-button ${isActive ? 'active' : ''}`}
      onClick={() => {
        if (canSelect && handleSelectSubcategory) {
          handleSelectSubcategory (subcategory.id);
        }
      }}
    >
      {subcategory.title}
    </div>
  );
};

export default SubcategoryElement;
