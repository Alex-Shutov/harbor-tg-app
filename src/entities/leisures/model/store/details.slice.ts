import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILeisureDetails } from '../types/details.domain.types';
import { EPageType } from '@shared/constants';

interface LeisureDetailsState {
  data: ILeisureDetails | null;
  type: EPageType | null;
}

const initialState: LeisureDetailsState = {
  data: null,
  type: null,
};

export const leisureDetailsSlice = createSlice({
  name: 'leisureDetails',
  initialState,
  reducers: {
    setLeisureDetailsData: (
      state,
      action: PayloadAction<{ data: ILeisureDetails; type: EPageType }>
    ) => {
      state.data = action.payload.data;
      state.type = action.payload.type;
    },
    clearLeisureDetailsData: (state) => {
      state.data = null;
      state.type = null;
    },
  },
});

export const { setLeisureDetailsData, clearLeisureDetailsData } =
  leisureDetailsSlice.actions;

export const leisureDetailsReducer = leisureDetailsSlice.reducer;

export const selectLeisureDetailsData = (state: {
  leisureDetails: LeisureDetailsState;
}) => state.leisureDetails.data;

export const selectLeisureDetailsType = (state: {
  leisureDetails: LeisureDetailsState;
}) => state.leisureDetails.type;
