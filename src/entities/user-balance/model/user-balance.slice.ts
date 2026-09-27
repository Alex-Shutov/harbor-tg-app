import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IUserBalanceState {
  isProcessing: boolean;
  error: string | null;
}

const initialState: IUserBalanceState = {
  isProcessing: false,
  error: null,
};

export const userBalanceSlice = createSlice({
  name: 'userBalance',
  initialState,
  reducers: {
    setProcessing: (state:IUserBalanceState, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload;
    },
    setError: (state:IUserBalanceState, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state:IUserBalanceState) => {
      state.error = null;
    },
  },
});

export const { setProcessing, setError, clearError } = userBalanceSlice.actions;
export const userBalanceReducer = userBalanceSlice.reducer;
