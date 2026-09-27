import React, { startTransition, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import './categories.scss';
import SubcategoriesBar from './components/SubCategoriesBar';
import { AccountCategory } from '../../../Account/account.types.ts';
import { Category } from './categroies.atoms.ts';
import { EventCategory } from '../../../Events/events.types.ts';
import { useSafeClick } from '../../../../hooks/useSafeClick.ts';
import { useHorizontalScroll } from '../../../../hooks/useHorizontalScroll.ts';
import { FavoritesCategory } from '../../../Account/components/Favorites/favorites.types.ts';
import { CloseButton } from '@shared/ui';
import { AsyncState } from '@shared/types/common.types';

type CategoryType = AccountCategory | Category | EventCategory | FavoritesCategory;

interface IProps {
  categories: AsyncState<CategoryType[]>;
  selectedCategory: CategoryType | number | null;
  onSelectCategory: (id: CategoryType | number | null) => void;
  selectedInnerCategory: number[] | null;
  onSelectInnerCategory: ((value: number[] | null) => void) | null;
  isFavorites: boolean;
  favorites?: AsyncState<any> | null;
  onCategoryClick?: (cat: number | null) => void;
  showDateFilter?: boolean;
  startDate?: Date | null;
  endDate?: Date | null;
  onClearDateFilter?: () => void;
}

interface CategoryItemProps {
  item: CategoryType,
  isActive: boolean,
  onClick: () => void,
  key?: number
}

export const CategoryItem: React.FC<CategoryItemProps> = ({ item, isActive, onClick }) => {
  const handlers = useSafeClick (onClick);
  return (
    <div
      className={`navigate-button ${isActive ? 'active' : ''}`}
      {...handlers}
    >
      {item.title}
    </div>
  );
};

const DateFilterItem: React.FC<{ dateText: string; onClick: () => void, handleClose:(e: React. MouseEvent)=>void }> = ({
                                                                               dateText,
                                                                               onClick,handleClose
                                                                             }) => {
  const handlers = useSafeClick(onClick);

  return (
    <div
      className={`navigate-button date-filter-item active`}
      {...handlers}
    >
      {dateText}
      <div
        onClick={(e) => {
          e.stopPropagation();
          handleClose(e);
        }}
        className="date-filter-item__close-wrapper"
      >
        <CloseButton
          onClick={() => {}}
          className="date-filter-item__close"
          aria-label="Очистить фильтр"
          size="small"
        />
      </div>
    </div>
  );
};

const formatDateDisplay = (start: Date | null, end: Date | null): string | null => {
  if (!start && !end) return null;

  const monthNames = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн',
    'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];

  if (start && !end) {
    return `${start.getDate()} ${monthNames[start.getMonth()]}.`;
  }

  if (start && end) {
    const startMonth = monthNames[start.getMonth()];
    const endMonth = monthNames[end.getMonth()];

    if (start.getMonth() === end.getMonth()) {
      return `${start.getDate()}-${end.getDate()} ${startMonth}`;
    } else {
      return `${start.getDate()} ${startMonth} - ${end.getDate()} ${endMonth}`;
    }
  }

  return null;
};

const CategoriesBar: React.FC<IProps> = ({
                                           categories,
                                           selectedCategory,
                                           onSelectCategory,
                                           selectedInnerCategory,
                                           onSelectInnerCategory,
                                           isFavorites,
                                           onCategoryClick,
                                           favorites = null,
                                           showDateFilter = false,
                                           startDate = null,
                                           endDate = null,
                                           onClearDateFilter,
                                         }) => {
  const { containerRef, contentRef, x, constraints, recalculate } = useHorizontalScroll();

  const dateDisplay = useMemo(() => {
    if (!showDateFilter) return null;
    return formatDateDisplay(startDate, endDate);
  }, [showDateFilter, startDate, endDate]);

  const selectedCategoryData = useMemo (
    () =>
      categories.state === 'hasData'
        ? categories.data?.find (cat => cat?.id === selectedCategory)
        : undefined,
    [categories, selectedCategory],
  );

  useEffect(() => {
    if (categories.state === 'hasData') {
      recalculate();
    }
  }, [categories]);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClearDateFilter?.();
  };

  if (isFavorites && favorites?.state==='hasData' &&  favorites?.data.isEmpty) {
    return <></>
  }

  if ( categories.state === 'loading') return <></>;

  const handleSelectCategory = (id: CategoryType | number) => {
    startTransition(() => {
      const isCurrentlyActive = isFavorites
        ? (selectedCategory as CategoryType)?.id === (id as CategoryType).id &&
        (selectedCategory as FavoritesCategory).type === (id as FavoritesCategory).type
        : selectedCategory === id;

      if (isCurrentlyActive) {
        onCategoryClick && onCategoryClick(null);
        onSelectInnerCategory?.(null);
        onSelectCategory(null);
      } else {
        onCategoryClick && onCategoryClick(id as number);
        onSelectInnerCategory?.(null);
        onSelectCategory(id);
      }
    });
  };

  const handleDateFilterClick = () => {
  };

  return (
    <>
      <div ref={containerRef} className="navigate-bar-container">
        <motion.div
          className="navigate-bar"
          ref={contentRef}
          drag="x"
          dragConstraints={constraints}
          dragElastic={0.1}
          style={{ x }}
          whileTap={{ cursor: 'grabbing' }}
        >
          <div className="navigate-bar-content">
            {showDateFilter && dateDisplay && (
              <DateFilterItem
                handleClose={handleClose}
                dateText={dateDisplay}
                onClick={handleDateFilterClick}
              />
            )}

            {categories.state === 'hasData' &&
              categories.data.map (item => (
                <CategoryItem
                  key={item.id}
                  item={item}
                  isActive={isFavorites ? (selectedCategory as CategoryType)?.id === item.id && (selectedCategory as FavoritesCategory).type === (item as FavoritesCategory).type : selectedCategory === item.id}
                  onClick={() => handleSelectCategory (isFavorites ? item : item.id)}
                />
              ))}
          </div>
        </motion.div>
      </div>

      {selectedCategoryData?.innerCategories && onSelectInnerCategory && (
        <SubcategoriesBar
          selectedInnerCategory={selectedInnerCategory}
          onSelectInnerCategory={onSelectInnerCategory}
          subcategories={selectedCategoryData.innerCategories}
        />
      )}
    </>
  );
};

export default CategoriesBar;
