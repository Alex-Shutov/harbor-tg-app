import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store/store.ts';

export const selectFilterFavorites = (state: RootState) => state.filterFavorites;

export const selectFavoriteTypeCategory = createSelector(
  [selectFilterFavorites],
  (filters) => filters.favoriteTypeCategory
);

export const selectSelectedFavoriteCategory = createSelector(
  [selectFilterFavorites],
  (filters) => filters.selectedCategory
);
