import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IEstablishmentDetails } from '../types/details.domain.types';
import { EPageType } from '@/shared/constants/types.constants';

interface EstablishmentState {
  data: IEstablishmentDetails | null;
  type: EPageType | null;
}

const initialState: EstablishmentState = {
  data: null,
  type: null,
};

export const detailsSlice = createSlice({
  name: 'establishmentDetails',
  initialState,
  reducers: {
    setDetailsData: (
      state,
      action: PayloadAction<{ data: IEstablishmentDetails; type: EPageType }>
    ) => {
      state.data = action.payload.data;
      state.type = action.payload.type;
    },
    clearDetailsData: (state) => {
      state.data = null;
      state.type = null;
    },
  },
});

export const { setDetailsData, clearDetailsData } = detailsSlice.actions;

export const establishmentDetailsReducer = detailsSlice.reducer;

export const selectDetailsData = (state: { establishmentDetails: EstablishmentState }) =>
  state.establishmentDetails.data;

export const selectDetailsType = (state: { establishmentDetails: EstablishmentState }) =>
  state.establishmentDetails.type;
