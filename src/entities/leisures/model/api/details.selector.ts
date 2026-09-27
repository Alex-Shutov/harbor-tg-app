import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store/store';
import { leisuresDetailsApi } from './details.api';

export const makeSelectLeisure = (id: number) =>
  createSelector(
    (state: RootState) =>
      leisuresDetailsApi.endpoints.getLeisure.select(id)(state),
    (result) => result.data
  );

export const makeSelectIsLeisureLoading = (id: number) =>
  createSelector(
    (state: RootState) =>
      leisuresDetailsApi.endpoints.getLeisure.select(id)(state),
    (result) => result.isLoading
  );

export const makeSelectLeisureError = (id: number) =>
  createSelector(
    (state: RootState) =>
      leisuresDetailsApi.endpoints.getLeisure.select(id)(state),
    (result) => result.error
  );
