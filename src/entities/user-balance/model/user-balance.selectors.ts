import { userBalanceApi } from '../api/user-balance.api';
import { RootState } from '@/store/store.ts';

export const selectUserBalance = userBalanceApi.endpoints.getUserBalance.select(undefined);

export const selectUserBalanceData = (state: RootState) => {
  const result = selectUserBalance(state);
  return result.data?.urbanBonusBalance ?? 0;
};

export const selectUserBalanceLoading = (state: RootState) => {
  const result = selectUserBalance(state);
  return result.isLoading;
};

export const selectUserBalanceError = (state: RootState) => {
  const result = selectUserBalance(state);
  return result.error;
};

export const selectUserBalanceProcessing = (state: RootState) => {
  return state.userBalance.isProcessing;
};

