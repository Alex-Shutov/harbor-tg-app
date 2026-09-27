import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@/store/store';
import { detailsApi } from './details.api.ts';

export const makeSelectEstablishment = (id: number) =>
  createSelector(
    (state: RootState) =>
      detailsApi.endpoints.getEstablishment.select(id)(state),
    (result) => result.data
  );

export const makeSelectIsEstablishmentLoading = (id: number) =>
  createSelector(
    (state: RootState) =>
      detailsApi.endpoints.getEstablishment.select(id)(state),
    (result) => result.isLoading
  );

export const makeSelectEstablishmentError = (id: number) =>
  createSelector(
    (state: RootState) =>
      detailsApi.endpoints.getEstablishment.select(id)(state),
    (result) => result.error
  );
