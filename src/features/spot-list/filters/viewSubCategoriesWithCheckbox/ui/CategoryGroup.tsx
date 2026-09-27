import React, { useMemo, useState } from 'react';
import { Checkbox } from '@shared/ui';
import { IApiCategory } from '@shared/types';

interface CategoryGroupProps {
  category: IApiCategory;
  selectedSubcategoryIds: number[];
  onSubcategoryToggle: (subcategoryId: number) => void;
}

export const CategoryGroup: React.FC<CategoryGroupProps> = ({
                                                       category,
                                                       selectedSubcategoryIds=[],
                                                       onSubcategoryToggle,
                                                     }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  //@ts-ignore
  const hasMultipleSubcategories = category?.innerCategories?.length > 3;

  const visibleSubcategories = useMemo(() => {
    if (!hasMultipleSubcategories || isExpanded) {
      return category.innerCategories;
    }
    return category?.innerCategories?.slice(0, 3);
  }, [category.innerCategories, hasMultipleSubcategories, isExpanded]);
  return (
    <div className="sub-categories__group">
      <h3 className="sub-categories__group-title">{category.innerCategoryTitle}</h3>
      <div className="sub-categories__items">
        {visibleSubcategories && visibleSubcategories.map((subcategory) => (
          <React.Fragment key={subcategory.id}>
            <Checkbox
              checked={Array.isArray(selectedSubcategoryIds) &&  selectedSubcategoryIds.includes(subcategory.id)}
              onChange={() => onSubcategoryToggle(subcategory.id)}
              label={subcategory.title}
            />
            {/*<span className="sub-categories__item-label">{subcategory.title}</span>*/}
          </React.Fragment>
        ))}
      </div>
      {hasMultipleSubcategories && !isExpanded && (
        <button
          type="button"
          className="sub-categories__show-more"
          onClick={() => setIsExpanded(true)}
        >
          Показать еще
        </button>
      )}
      {hasMultipleSubcategories && isExpanded && (
        <button
          type="button"
          className="sub-categories__show-more"
          onClick={() => setIsExpanded(false)}
        >
          Скрыть
        </button>
      )}
    </div>
  );
};