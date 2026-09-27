import React, { useMemo } from 'react';
import SubcategoryElement from './SubcategoryElement';
import { Category } from '../../pages/Establishments/components/CategoriesBar/categroies.atoms.ts';

interface SubcategoriesListProps {
  subcategories: Omit<Category, "innerCategoriesTitle">[];
  selectedSubcategory?: number | number[] | null ;
  canSelect?: boolean;
  handleSelectSubcategory?: (id: number) => void;
}

const SubcategoriesList: React.FC<SubcategoriesListProps> = ({
                                                               subcategories,
                                                               selectedSubcategory,
                                                               canSelect = true,
                                                               handleSelectSubcategory,
                                                             }) => {
  const selectedSubCategories = useMemo(()=>{
    if (selectedSubcategory!==undefined) {
      if (Array.isArray(selectedSubcategory)) return selectedSubcategory
      else if (selectedSubcategory!==null) return [selectedSubcategory]
    }
  },[subcategories,selectedSubcategory])
  return (
    <div className={'subcategory-bar--content'}>
      {subcategories.map((subcategory) => (
        <SubcategoryElement
          key={subcategory.id}
          subcategory={subcategory as any}
          selectedSubcategory={selectedSubCategories}
          canSelect={canSelect}
          handleSelectSubcategory={handleSelectSubcategory}
        />
      ))}
    </div>
  );
};

export default SubcategoriesList;
