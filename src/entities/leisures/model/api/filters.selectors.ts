import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store/store.ts';

export const selectFilterLeisures = (state: RootState) => state.filterLeisures;

export const selectSelectedLeisureCategoryId = createSelector(
  [selectFilterLeisures],
  (filters) => filters.selectedCategoryId
);

export const selectSelectedLeisureSubcategoryIds = createSelector(
  [selectFilterLeisures],
  (filters) => filters.selectedSubcategoryIds
);

export const selectLeisureSearchValue = createSelector(
  [selectFilterLeisures],
  (filters) => filters.searchValue
);
