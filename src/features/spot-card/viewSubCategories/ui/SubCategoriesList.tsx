import React from 'react';
import { SubcategoryButton } from '@/features/spot-card/viewSubCategories/ui/SubcategoryButton.tsx';
import { IEstablishmentCategory, IEstablishmentInnerCategory } from '@shared/types';
import './list.scss'
interface CategoriesListProps {
  categories: IEstablishmentCategory[] | IEstablishmentInnerCategory[];
  selectedCategoryId?: number | null;
  canSelect?: boolean;
  onSelectCategory?: (categoryId: number) => void;
}

export const CategoriesList: React.FC<CategoriesListProps> = ({
                                                                categories,
                                                                selectedCategoryId = null,
                                                                canSelect = false,
                                                                onSelectCategory,
                                                              }) => {
  return (
    <div className="subcategories-list">
      {categories.map((category) => (
        <SubcategoryButton
          category={category}
          isActive={selectedCategoryId === category.id}
          canSelect={canSelect}
          onClick={() => {
            if (canSelect && onSelectCategory) {
              onSelectCategory(category.id);
            }
          }}
        />
      ))}
    </div>
  );
};
