import { baseApi } from '@shared/api/redux.api.ts';
import { Banner, CollectionItem, IApiCategory } from '@shared/types';
import {
  ApiEstablishment,
  GroupedApiResponse,
  mapEstablishmentCategories,
  mapEstablishmentList,
} from '@pages/Establishments/main.mapper.ts';

export const allLeisureCategory: IApiCategory = {
  id: 0,
  title: 'Все',
  serialNumber: 0,
};

export interface LeisuresListParams {
  categoryId?: number | null;
  innerCategoriesIds?: number | null;
  searchValue?: string;
}

export const leisuresListApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getLeisureCategories: build.query<IApiCategory[], void>({
      query: () => ({ url: '/leisure/categories/all', method: 'GET' }),
      transformResponse: (response: { categories: IApiCategory[] }) => [
        allLeisureCategory,
        ...(response.categories ?? []),
      ],
      providesTags: ['Leisure'],
    }),

    getLeisureCollections: build.query<CollectionItem[], void>({
      query: () => ({ url: '/leisure/selections/all', method: 'GET' }),
      transformResponse: (response: { selections: CollectionItem[] }) => response?.selections ?? [],
    }),

    getLeisureSliderImages: build.query<Banner[], void>({
      query: () => ({ url: '/leisure/slider/content', method: 'GET' }),
      transformResponse: (response: { sliders: Banner[] }) => response?.sliders ?? [],
    }),

    captureLeisureSliderClick: build.mutation<void, number>({
      query: (slideId) => ({
        url: `/leisure/slider/capture/user/click?slideId=${slideId}`,
        method: 'POST',
      }),
    }),

    getLeisuresList: build.query<any, LeisuresListParams>({
      queryFn: async (params, _queryApi, _extraOptions, fetchWithBQ) => {
        const requestParams: Record<string, unknown> = {
          searchValue: params.searchValue ?? '',
        };

        if (params.categoryId) {
          requestParams.categoryId = params.categoryId.toString();
          requestParams.innerCategoriesIds = params.innerCategoriesIds ?? undefined;

          const result = await fetchWithBQ({ url: '/leisure/find', method: 'GET', params: requestParams });
          if (result.error) return { error: result.error };
          return { data: mapEstablishmentList(result.data as ApiEstablishment[], 'LEISURE') };
        }

        const result = await fetchWithBQ({
          url: '/leisure/find/for/all/categories',
          method: 'GET',
          params: requestParams,
        });
        if (result.error) return { error: result.error };
        return { data: mapEstablishmentCategories(result.data as GroupedApiResponse, 'LEISURE') };
      },
      providesTags: ['Leisure'],
    }),
  }),
});

export const {
  useGetLeisureCategoriesQuery,
  useGetLeisureCollectionsQuery,
  useGetLeisureSliderImagesQuery,
  useCaptureLeisureSliderClickMutation,
  useGetLeisuresListQuery,
} = leisuresListApi;
