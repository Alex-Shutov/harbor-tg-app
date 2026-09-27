import React, { useMemo } from 'react';
import './sub-categroies.scss';
import { IApiCategory } from '@shared/types';
import { CategoryGroup } from './CategoryGroup.tsx';

interface SubCategoriesProps {
  categories: IApiCategory[];
  selectedCategoryId: number | null;
  selectedSubcategoryIds: number[];
  onSubcategoryToggle: (subcategoryId: number) => void;
}

export const SubCategories: React.FC<SubCategoriesProps> = ({
                                                              categories,
                                                              selectedCategoryId,
                                                              selectedSubcategoryIds,
                                                              onSubcategoryToggle,
                                                            }) => {
  const displayCategories = useMemo(() => {
    if (selectedCategoryId) {
      const selected = categories.find(cat => cat.id === selectedCategoryId);
      return selected ? [selected] : [];
    }
    return []
  }, [categories, selectedCategoryId]);

  if (displayCategories.length === 0) {
    return null;
  }
  console.log(displayCategories,'displayCategories');

  return (
    <div className="sub-categories">
      {/*<h3 className="sub-categories__title">Кухня</h3>*/}
      {displayCategories.map((category) => (
        <CategoryGroup
          category={category}
          selectedSubcategoryIds={selectedSubcategoryIds}
          onSubcategoryToggle={onSubcategoryToggle}
        />
      ))}
    </div>
  );
};
