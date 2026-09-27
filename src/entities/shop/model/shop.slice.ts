import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';

interface IShopState {
  hiddenPromoCodeIds: number[];
}

const initialState: IShopState = {
  hiddenPromoCodeIds: [],
};

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    hidePromoCode: (state, action: PayloadAction<number>) => {
      const promoCodeId = action.payload;
      if (!state.hiddenPromoCodeIds.includes(promoCodeId)) {
        state.hiddenPromoCodeIds.push(promoCodeId);
      }
    },
    showPromoCode: (state, action: PayloadAction<number>) => {
      const promoCodeId = action.payload;
      state.hiddenPromoCodeIds = state.hiddenPromoCodeIds.filter(
        (id) => id !== promoCodeId
      );
    },
    clearHiddenPromoCodes: (state) => {
      state.hiddenPromoCodeIds = [];
    },
  },
});

export const { hidePromoCode, showPromoCode, clearHiddenPromoCodes } =
  shopSlice.actions;

export const selectHiddenPromoCodeIds = (state: RootState) =>
  state.shop.hiddenPromoCodeIds;

export default shopSlice.reducer;

