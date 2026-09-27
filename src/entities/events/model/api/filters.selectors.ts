import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store/store.ts';

export const selectFilterEvents = (state: RootState) => state.filterEvents;

export const selectSelectedEventCategoryId = createSelector(
  [selectFilterEvents],
  (filters) => filters.selectedCategoryId
);

export const selectSelectedEventSubcategoryIds = createSelector(
  [selectFilterEvents],
  (filters) => filters.selectedSubcategoryIds
);

export const selectEventStartDate = createSelector(
  [selectFilterEvents],
  (filters) => (filters.startDate ? new Date(filters.startDate) : null)
);

export const selectEventEndDate = createSelector(
  [selectFilterEvents],
  (filters) => (filters.endDate ? new Date(filters.endDate) : null)
);

export const selectEventSearchValue = createSelector(
  [selectFilterEvents],
  (filters) => filters.searchValue
);
