import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EventsFiltersState {
  selectedCategoryId: number | null;
  selectedSubcategoryIds: number[];
  startDate: string | null;
  endDate: string | null;
  searchValue: string;
}

const initialState: EventsFiltersState = {
  selectedCategoryId: null,
  selectedSubcategoryIds: [],
  startDate: null,
  endDate: null,
  searchValue: '',
};

const filterEventsSlice = createSlice({
  name: 'filterEvents',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<number | null>) => {
      state.selectedCategoryId = action.payload;
      state.selectedSubcategoryIds = [];
    },
    setSubcategories: (state, action: PayloadAction<number[] | null>) => {
      state.selectedSubcategoryIds = action.payload ?? [];
    },
    setDateRange: (state, action: PayloadAction<{ startDate: string | null; endDate: string | null }>) => {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
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
  setDateRange,
  setSearchValue,
  resetFilters,
} = filterEventsSlice.actions;

export default filterEventsSlice.reducer;
