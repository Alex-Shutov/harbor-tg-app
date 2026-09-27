import { baseApi } from '@shared/api/redux.api';
import { IApiShowcaseResponse, IApiSelectionsResponse, IApiBannersResponse } from '../types';
import { mapShowcaseFromApi, mapSelectionsFromApi, mapBannersFromApi } from '../mappers';
import { IShowcaseItem, ISelection, IBanner } from '../types';

export const mainApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getShowcase: build.query<IShowcaseItem[], void>({
      query: () => ({
        url: '/main/showcase',
        method: 'GET',
      }),
      transformResponse: (response: IApiShowcaseResponse): IShowcaseItem[] => {
        return mapShowcaseFromApi(response);
      },
      providesTags: ['Establishment', 'Event', 'Leisure'],
    }),
    getSelections: build.query<ISelection[], void>({
      query: () => ({
        url: '/main/selections',
        method: 'GET',
      }),
      transformResponse: (response: IApiSelectionsResponse): ISelection[] => {
        return mapSelectionsFromApi(response);
      },
      providesTags: ['Establishment', 'Event', 'Leisure'],
    }),
    getBanners: build.query<IBanner[], void>({
      query: () => ({
        url: '/main/banners',
        method: 'GET',
      }),
      transformResponse: (response: IApiBannersResponse): IBanner[] => {
        return mapBannersFromApi(response);
      },
      providesTags: ['Establishment'],
    }),
    search: build.query<IShowcaseItem[], string>({
      query: (searchValue) => ({
        url: '/main/search',
        method: 'GET',
        params: {
          searchValue,
        },
      }),
      transformResponse: (response: IApiShowcaseResponse): IShowcaseItem[] => {
        return mapShowcaseFromApi(response);
      },
      providesTags: ['Establishment', 'Event', 'Leisure'],
    }),
  }),
});

export const { useGetShowcaseQuery, useGetSelectionsQuery, useGetBannersQuery, useSearchQuery } = mainApi;

