import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IEventDetails } from '../types/details.domain.types.ts';
import { EPageType } from '@shared/constants';

interface EventDetailsState {
  data: IEventDetails | null;
  type: EPageType | null;
}

const initialState: EventDetailsState = {
  data: null,
  type: null,
};

export const eventDetailsSlice = createSlice({
  name: 'eventDetails',
  initialState,
  reducers: {
    setEventDetailsData: (
      state,
      action: PayloadAction<{ data: IEventDetails; type: EPageType }>
    ) => {
      state.data = action.payload.data;
      state.type = action.payload.type;
    },
    clearEventDetailsData: (state) => {
      state.data = null;
      state.type = null;
    },
  },
});
export const { setEventDetailsData, clearEventDetailsData } =
  eventDetailsSlice.actions;

export const eventDetailsReducer = eventDetailsSlice.reducer;

export const selectEventDetailsData = (state: {
  eventDetails: EventDetailsState;
}) => state.eventDetails.data;

export const selectEventDetailsType = (state: {
  eventDetails: EventDetailsState;
}) => state.eventDetails.type;
