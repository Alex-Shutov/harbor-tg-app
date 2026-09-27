import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store/store.ts';

export const selectFilterEstablishments = (state: RootState) => state.filterEstablishments;

export const selectSelectedCategoryId = createSelector(
  [selectFilterEstablishments],
  (filters) => filters.selectedCategoryId
);

export const selectSelectedSubcategoryIds = createSelector(
  [selectFilterEstablishments],
  (filters) => filters.selectedSubcategoryIds
);

export const selectWorkTime = createSelector(
  [selectFilterEstablishments],
  (filters) => filters.workTime
);

export const selectCostLevel = createSelector(
  [selectFilterEstablishments],
  (filters) => filters.costLevel
);

export const selectIsPromotionExist = createSelector(
  [selectFilterEstablishments],
  (filters) => filters.isPromotionExist
);

export const selectSearchValue = createSelector(
  [selectFilterEstablishments],
  (filters) => filters.searchValue
);

export const selectHasActiveFilters = createSelector(
  [selectFilterEstablishments],
  (filters) => {
    return (
      filters.selectedCategoryId !== null ||
      filters.selectedSubcategoryIds.length > 0 ||
      filters.workTime !== null ||
      filters.costLevel !== null ||
      filters.isPromotionExist !== null
    );
  }
);
