import { baseApi } from '@shared/api/redux.api.ts';
import { SelectionInfoResponse } from './selection.types.ts';

export const selectionApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSelection: build.query<SelectionInfoResponse, string>({
      query: (id) => ({ url: '/selection/get', method: 'GET', params: { id } }),
    }),
  }),
});

export const { useGetSelectionQuery } = selectionApi;
