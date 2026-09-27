import { baseApi } from '@shared/api/redux.api.ts';
import { Banner, CollectionItem, IApiCategory } from '@shared/types';
import { IWorkTimeOption } from '@/entities/lib';
import { ECostLevel } from '@shared/constants';
import {
  ApiEstablishment,
  GroupedApiResponse,
  mapEstablishmentCategories,
  mapEstablishmentList,
} from '@pages/Establishments/main.mapper.ts';

export const allEstablishmentCategory: IApiCategory = {
  id: 0,
  title: 'Все',
  serialNumber: 0,
};

export interface EstablishmentsListParams {
  categoryId?: number | null;
  innerCategoriesIds?: number[] | null;
  searchValue?: string;
  workTime?: IWorkTimeOption;
  costLevel?: ECostLevel | null;
  isPromotionExist?: boolean | null;
}

export const establishmentsListApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getEstablishmentCategories: build.query<IApiCategory[], void>({
      query: () => ({ url: '/food/establishments/categories/all', method: 'GET' }),
      transformResponse: (response: { categories: IApiCategory[] }) => [
        allEstablishmentCategory,
        ...(response.categories ?? []),
      ],
      providesTags: ['Establishment'],
    }),

    getEstablishmentCollections: build.query<CollectionItem[], void>({
      query: () => ({ url: '/food/establishments/selections/all', method: 'GET' }),
      transformResponse: (response: { selections: CollectionItem[] }) => response?.selections ?? [],
    }),

    getEstablishmentSliderImages: build.query<Banner[], void>({
      query: () => ({ url: '/food/establishments/slider/content', method: 'GET' }),
      transformResponse: (response: { sliders: Banner[] }) => response?.sliders ?? [],
    }),

    captureEstablishmentSliderClick: build.mutation<void, number>({
      query: (slideId) => ({
        url: `/food/establishments/slider/capture/user/click?slideId=${slideId}`,
        method: 'POST',
      }),
    }),

    getEstablishmentsList: build.query<any, EstablishmentsListParams>({
      queryFn: async (params, _queryApi, _extraOptions, fetchWithBQ) => {
        const requestParams: Record<string, unknown> = {};

        if (params.searchValue?.trim()) {
          requestParams.searchValue = params.searchValue;
        }
        if (params.innerCategoriesIds?.length) {
          requestParams.innerCategoriesIds = params.innerCategoriesIds;
        }
        if (params.workTime) {
          requestParams.openStatus = params.workTime === 'Открыто' ? 'OPEN' : 'AROUND_THE_CLOCK';
        }
        if (params.costLevel) {
          requestParams.costLevel = params.costLevel;
        }
        if (params.isPromotionExist !== null && params.isPromotionExist !== undefined) {
          requestParams.isPromotionExist = params.isPromotionExist;
        }

        if (params.categoryId) {
          requestParams.categoryId = params.categoryId.toString();

          const result = await fetchWithBQ({
            url: '/food/establishments/find',
            method: 'GET',
            params: requestParams,
          });
          if (result.error) return { error: result.error };
          return { data: mapEstablishmentList(result.data as ApiEstablishment[]) };
        }

        const result = await fetchWithBQ({
          url: '/food/establishments/find/for/all/categories',
          method: 'GET',
          params: requestParams,
        });
        if (result.error) return { error: result.error };
        return { data: mapEstablishmentCategories(result.data as GroupedApiResponse) };
      },
      providesTags: ['Establishment'],
    }),
  }),
});

export const {
  useGetEstablishmentCategoriesQuery,
  useGetEstablishmentCollectionsQuery,
  useGetEstablishmentSliderImagesQuery,
  useCaptureEstablishmentSliderClickMutation,
  useGetEstablishmentsListQuery,
} = establishmentsListApi;
