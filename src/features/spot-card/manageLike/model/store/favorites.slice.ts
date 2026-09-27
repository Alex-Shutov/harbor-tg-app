import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EObjectType } from '@shared/constants';

export interface IFavoritesState {
  // Ключ: `${id}_${objectType}`, значение: boolean
  favorites: Record<string, boolean>;
}

const initialState: IFavoritesState = {
  favorites: {},
};

const getFavoriteKey = (id: number, objectType: EObjectType): string => {
  return `${id}_${objectType}`;
};

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    setFavorite: (
      state: IFavoritesState,
      action: PayloadAction<{ id: number; objectType: EObjectType; isLiked: boolean }>
    ) => {
      const key = getFavoriteKey(action.payload.id, action.payload.objectType);
      state.favorites[key] = action.payload.isLiked;
    },
    toggleFavorite: (
      state: IFavoritesState,
      action: PayloadAction<{ id: number; objectType: EObjectType }>
    ) => {
      const key = getFavoriteKey(action.payload.id, action.payload.objectType);
      const currentValue = state.favorites[key] ?? false;
      state.favorites[key] = !currentValue;
    },
    initializeFavorites: (
      state: IFavoritesState,
      action: PayloadAction<Array<{ id: number; objectType: EObjectType; isLiked: boolean }>>
    ) => {
      action.payload.forEach(({ id, objectType, isLiked }) => {
        const key = getFavoriteKey(id, objectType);
        state.favorites[key] = isLiked;
      });
    },
    clearFavorites: (state: IFavoritesState) => {
      state.favorites = {};
    },
  },
});

export const { setFavorite, toggleFavorite, initializeFavorites, clearFavorites } = favoritesSlice.actions;
export const favoritesReducer = favoritesSlice.reducer;

// Селекторы
export const selectIsFavorite = (id: number, objectType: EObjectType) => (state: { favorites: IFavoritesState }): boolean | undefined => {
  const key = getFavoriteKey(id, objectType);
  return state.favorites.favorites[key];
};

