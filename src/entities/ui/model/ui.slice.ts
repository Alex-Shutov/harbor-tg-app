import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';

type UiState = {
  calendarValue: string | null;
  searchQuery: string;
  selectedEstablishmentCategoryId: number | null;
  selectedEventCategoryId: number | null;
  selectedLeisureCategoryId: number | null;
};

const initialState: UiState = {
  calendarValue: null,
  searchQuery: '',
  selectedEstablishmentCategoryId: null,
  selectedEventCategoryId: null,
  selectedLeisureCategoryId: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setCalendarValue(state, action: PayloadAction<string | null>) {
      state.calendarValue = action.payload;
    },
    setUiSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setSelectedEstablishmentCategoryId(state, action: PayloadAction<number | null>) {
      state.selectedEstablishmentCategoryId = action.payload;
    },
    setSelectedEventCategoryId(state, action: PayloadAction<number | null>) {
      state.selectedEventCategoryId = action.payload;
    },
    setSelectedLeisureCategoryId(state, action: PayloadAction<number | null>) {
      state.selectedLeisureCategoryId = action.payload;
    },
  },
});

export const {
  setCalendarValue,
  setUiSearchQuery,
  setSelectedEstablishmentCategoryId,
  setSelectedEventCategoryId,
  setSelectedLeisureCategoryId,
} = uiSlice.actions;

export const selectCalendarValue = (state: RootState) => state.ui.calendarValue;
export const selectUiSearchQuery = (state: RootState) => state.ui.searchQuery;
export const uiReducer = uiSlice.reducer;
