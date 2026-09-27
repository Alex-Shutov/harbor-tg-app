import React from 'react';
import './main-categories.scss';
import { Chip } from '@shared/ui';
import { IApiCategory } from '@shared/types';

interface MainCategoriesProps {
  categories: IApiCategory[];
  selectedCategoryId: number | null;
  onCategoryClick: (categoryId: number | null) => void;
  mode?: 'page' | 'filter';
}

export const MainCategories: React.FC<MainCategoriesProps> = ({
                                                                categories,
                                                                selectedCategoryId,
                                                                onCategoryClick,
                                                                mode = 'filter',
                                                              }) => {
  const handleCategoryClick = (categoryId: number) => {
    if (selectedCategoryId === categoryId) {
      onCategoryClick(null);
    } else {
      onCategoryClick(categoryId);
    }
  };

  const containerClass = mode === 'filter'
    ? 'main-categories main-categories--filter'
    : 'main-categories main-categories--page';

  return (
    <div className={containerClass}>
      <div className="main-categories__content">
        {categories.map((category) => (
          <Chip
            isActive={selectedCategoryId === category.id}
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.title}
          </Chip>
        ))}
      </div>
    </div>
  );
};
