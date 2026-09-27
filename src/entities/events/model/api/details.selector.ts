import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store/store.ts';
import { eventsDetailsApi } from './details.api.ts';

export const makeSelectEvent = (id: number) =>
  createSelector(
    (state: RootState) => eventsDetailsApi.endpoints.getEvent.select(id)(state),
    (result) => result.data
  );

export const makeSelectIsEventLoading = (id: number) =>
  createSelector(
    (state: RootState) => eventsDetailsApi.endpoints.getEvent.select(id)(state),
    (result) => result.isLoading
  );

export const makeSelectEventError = (id: number) =>
  createSelector(
    (state: RootState) => eventsDetailsApi.endpoints.getEvent.select(id)(state),
    (result) => result.error
  );
