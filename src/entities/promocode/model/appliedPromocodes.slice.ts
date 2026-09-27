import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IAppliedPromocodeState {
  issuedAt: string; // Дата и время выдачи промокода
  appliedCount: number; // Количество применений
  receivedPromoCodeId?: number; // ID полученного промокода после покупки
}

interface AppliedPromocodesState {
  promocodes: Record<number, IAppliedPromocodeState>;
}

const initialState: AppliedPromocodesState = {
  promocodes: {},
};

export const appliedPromocodesSlice = createSlice({
  name: 'appliedPromocodes',
  initialState,
  reducers: {
    setAppliedPromocode: (
      state,
      action: PayloadAction<{
        promoCodeId: number;
        issuedAt: string;
        appliedCount: number;
        receivedPromoCodeId?: number;
      }>
    ) => {
      debugger;
      state.promocodes[action.payload.promoCodeId] = {
        issuedAt: action.payload.issuedAt,
        appliedCount: action.payload.appliedCount,
        ...(action.payload.receivedPromoCodeId !== undefined && {
          receivedPromoCodeId: action.payload.receivedPromoCodeId,
        }),
      };
    },
    updateAppliedPromocode: (
      state,
      action: PayloadAction<{
        promoCodeId: number;
        appliedCount?: number;
        issuedAt?: string;
        receivedPromoCodeId?: number;
      }>
    ) => {
      debugger;
      const existing = state.promocodes[action.payload.promoCodeId];
      if (existing) {
        state.promocodes[action.payload.promoCodeId] = {
          ...existing,
          ...(action.payload.appliedCount !== undefined && {
            appliedCount: action.payload.appliedCount,
          }),
          ...(action.payload.issuedAt !== undefined && {
            issuedAt: action.payload.issuedAt,
          }),
          ...(action.payload.receivedPromoCodeId !== undefined && {
            receivedPromoCodeId: action.payload.receivedPromoCodeId,
          }),
        };
      }
    },
    clearAppliedPromocode: (
      state,
      action: PayloadAction<{ promoCodeId: number }>
    ) => {
      delete state.promocodes[action.payload.promoCodeId];
    },
    clearAllAppliedPromocodes: (state) => {
      state.promocodes = {};
    },
    setPurchasedPromocode: (
      state,
      action: PayloadAction<{
        promoCodeId: number;
        receivedPromoCodeId: number;
      }>
    ) => {
      debugger;
      const existing = state.promocodes[action.payload.promoCodeId];
      if (existing) {
        state.promocodes[action.payload.promoCodeId] = {
          ...existing,
          receivedPromoCodeId: action.payload.receivedPromoCodeId,
        };
      } else {
        state.promocodes[action.payload.promoCodeId] = {
          issuedAt: new Date().toISOString(),
          appliedCount: 0,
          receivedPromoCodeId: action.payload.receivedPromoCodeId,
        };
      }
    },
  },
});

export const {
  setAppliedPromocode,
  updateAppliedPromocode,
  clearAppliedPromocode,
  clearAllAppliedPromocodes,
  setPurchasedPromocode,
} = appliedPromocodesSlice.actions;

export const appliedPromocodesReducer = appliedPromocodesSlice.reducer;

export const selectAppliedPromocode = (
  state: { appliedPromocodes: AppliedPromocodesState },
  promoCodeId: number
): IAppliedPromocodeState | undefined => {
  return state.appliedPromocodes.promocodes[promoCodeId];
};

export const selectAllAppliedPromocodes = (
  state: { appliedPromocodes: AppliedPromocodesState }
): Record<number, IAppliedPromocodeState> => {
  return state.appliedPromocodes.promocodes;
};

