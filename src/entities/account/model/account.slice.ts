import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';
import type { UserProfile } from '@/pages/Account/account.types';

const defaultProfile: UserProfile = {
  id: 0,
  displayName: 'Гость',
  username: '@guest',
  photoUrl: null,
};

type AccountState = {
  userProfile: UserProfile;
  searchQuery: string;
};

const initialState: AccountState = {
  userProfile: defaultProfile,
  searchQuery: '',
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setUserProfile(state, action: PayloadAction<UserProfile>) {
      state.userProfile = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
  },
});

export const { setUserProfile, setSearchQuery } = accountSlice.actions;
export const selectUserProfile = (state: RootState) => state.account.userProfile;
export const selectSearchQuery = (state: RootState) => state.account.searchQuery;
export const accountReducer = accountSlice.reducer;
