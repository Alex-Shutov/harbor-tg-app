import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  selectCostLevel,
  selectHasActiveFilters,
  selectIsPromotionExist,
  selectSearchValue,
  selectSelectedCategoryId,
  selectSelectedSubcategoryIds,
  selectWorkTime,
  useGetEstablishmentCategoriesQuery,
} from '@/entities/establishments/model/api';
import {
  resetFilters,
  setCostLevel,
  setIsPromotionExist,
  setSearchValue,
  setSelectedCategory,
  setSubcategories,
  setWorkTime,
  toggleSubcategory,
} from '@/entities/establishments/model/store/filters.slice.ts';
import { IWorkTimeOption } from '@/entities/lib';
import { ECostLevel } from '@shared/constants';

export const useFiltersEstablishments = () => {
  const dispatch = useAppDispatch();

  const selectedCategoryId = useAppSelector(selectSelectedCategoryId);
  const selectedSubcategoryIds = useAppSelector(selectSelectedSubcategoryIds);
  const workTime = useAppSelector(selectWorkTime);
  const costLevel = useAppSelector(selectCostLevel);
  const isPromotionExist = useAppSelector(selectIsPromotionExist);
  const hasActiveFilters = useAppSelector(selectHasActiveFilters);
  const searchValue = useAppSelector(selectSearchValue);

  const { data: allCategories } = useGetEstablishmentCategoriesQuery();
  const categories = (allCategories ?? []).filter((cat) => cat.id !== 0);

  const selectCategory = (categoryId: number | null) => {
    dispatch(setSelectedCategory(categoryId));
  };

  const toggleSubcategorySelection = (subcategoryId: number) => {
    dispatch(toggleSubcategory(subcategoryId));
  };

  const selectSubcategories = (subcategoryIds: number[] | null) => {
    dispatch(setSubcategories(subcategoryIds));
  };

  const updateSearchValue = (value: string) => {
    dispatch(setSearchValue(value));
  };

  const updateWorkTime = (option: IWorkTimeOption) => {
    dispatch(setWorkTime(option));
  };

  const updateCostLevel = (level: ECostLevel | null) => {
    dispatch(setCostLevel(level));
  };

  const togglePromotion = () => {
    dispatch(setIsPromotionExist(isPromotionExist === true ? null : true));
  };

  const resetAllFilters = () => {
    dispatch(resetFilters());
  };

  return {
    selectedCategoryId,
    selectedSubcategoryIds,
    workTime,
    costLevel,
    isPromotionExist,
    searchValue,
    categories,
    hasActiveFilters,
    selectCategory,
    toggleSubcategorySelection,
    selectSubcategories,
    updateSearchValue,
    updateWorkTime,
    updateCostLevel,
    togglePromotion,
    resetAllFilters,
  };
};
