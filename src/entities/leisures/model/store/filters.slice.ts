import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LeisuresFiltersState {
  selectedCategoryId: number | null;
  selectedSubcategoryIds: number[];
  searchValue: string;
}

const initialState: LeisuresFiltersState = {
  selectedCategoryId: null,
  selectedSubcategoryIds: [],
  searchValue: '',
};

const filterLeisuresSlice = createSlice({
  name: 'filterLeisures',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<number | null>) => {
      state.selectedCategoryId = action.payload;
      state.selectedSubcategoryIds = [];
    },
    setSubcategories: (state, action: PayloadAction<number[] | null>) => {
      state.selectedSubcategoryIds = action.payload ?? [];
    },
    setSearchValue: (state, action: PayloadAction<string>) => {
      state.searchValue = action.payload;
    },
    resetFilters: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setSelectedCategory,
  setSubcategories,
  setSearchValue,
  resetFilters,
} = filterLeisuresSlice.actions;

export default filterLeisuresSlice.reducer;
