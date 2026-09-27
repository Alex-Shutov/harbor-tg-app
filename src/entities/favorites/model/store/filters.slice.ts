import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FavoritesCategory } from '@/pages/Account/components/Favorites/favorites.types.ts';

export type FavoriteType = 'ESTABLISHMENT' | 'EVENT' | 'LEISURE' | null;

interface FavoritesFiltersState {
  favoriteTypeCategory: FavoriteType;
  selectedCategory: FavoritesCategory;
}

const defaultSelectedCategory: FavoritesCategory = {
  id: 0,
  title: 'Все',
  type: '',
  entityType: '',
};

const initialState: FavoritesFiltersState = {
  favoriteTypeCategory: null,
  selectedCategory: defaultSelectedCategory,
};

const filterFavoritesSlice = createSlice({
  name: 'filterFavorites',
  initialState,
  reducers: {
    setFavoriteTypeCategory: (state, action: PayloadAction<FavoriteType>) => {
      state.favoriteTypeCategory = action.payload;
    },
    setSelectedFavoriteCategory: (state, action: PayloadAction<FavoritesCategory>) => {
      state.selectedCategory = action.payload;
    },
    resetSelectedFavoriteCategory: (state) => {
      state.selectedCategory = defaultSelectedCategory;
    },
    resetFavoriteTypeCategory: (state) => {
      state.favoriteTypeCategory = null;
    },
    resetFavoritesFilters: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setFavoriteTypeCategory,
  setSelectedFavoriteCategory,
  resetSelectedFavoriteCategory,
  resetFavoriteTypeCategory,
  resetFavoritesFilters,
} = filterFavoritesSlice.actions;

export default filterFavoritesSlice.reducer;
