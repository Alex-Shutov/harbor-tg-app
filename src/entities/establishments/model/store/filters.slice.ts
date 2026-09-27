import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IEstablishmentFiltersState } from '@/entities/establishments/model/types';
import { IWorkTimeOption } from '@/entities/lib';
import { ECostLevel } from '@shared/constants';

const initialState: IEstablishmentFiltersState = {
  selectedCategoryId: null,
  selectedSubcategoryIds: [],
  workTime: null,
  costLevel: null,
  isPromotionExist: null,
  searchValue: '',
};

const filterEstablishmentsSlice = createSlice({
  name: 'filterEstablishments',
  initialState,
  reducers: {
    setSelectedCategory: (state, action: PayloadAction<number | null>) => {
      state.selectedCategoryId = action.payload;
      state.selectedSubcategoryIds = [];
    },

    setSubcategories: (state, action: PayloadAction<number[] | null>) => {
      state.selectedSubcategoryIds = action.payload ?? [];
    },

    toggleSubcategory: (state, action: PayloadAction<number>) => {
      const subcategoryId = action.payload;
      const index = state.selectedSubcategoryIds.indexOf(subcategoryId);

      if (index > -1) {
        state.selectedSubcategoryIds.splice(index, 1);
      } else {
        state.selectedSubcategoryIds.push(subcategoryId);
      }
    },

    setWorkTime: (state, action: PayloadAction<IWorkTimeOption>) => {
      state.workTime = action.payload;
    },

    setCostLevel: (state, action: PayloadAction<ECostLevel | null>) => {
      state.costLevel = action.payload;
    },

    setIsPromotionExist: (state, action: PayloadAction<boolean | null>) => {
      state.isPromotionExist = action.payload;
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
  toggleSubcategory,
  setWorkTime,
  setCostLevel,
  setIsPromotionExist,
  setSearchValue,
  resetFilters,
} = filterEstablishmentsSlice.actions;

export default filterEstablishmentsSlice.reducer;
