import { baseApi } from '@shared/api/redux.api.ts';
import { Banner, CollectionItem, IApiCategory } from '@shared/types';
import { formatDateWithOnlyDigits } from '../../../../utils/date.ts';
import {
  ApiEvent,
  GroupedApiEventResponse,
  mapEventsCategories,
  mapEventsList,
} from '@pages/Events/events.mapper.ts';

export const allEventCategory: IApiCategory = {
  id: 0,
  title: 'Все',
  serialNumber: 0,
};

export interface EventsListParams {
  categoryId?: number | null;
  innerCategoriesIds?: number | null;
  searchValue?: string;
  startDate?: Date | null;
  endDate?: Date | null;
}

export const eventsListApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getEventCategories: build.query<IApiCategory[], void>({
      query: () => ({ url: '/event/categories/all', method: 'GET' }),
      transformResponse: (response: { categories: IApiCategory[] }) => [
        allEventCategory,
        ...(response.categories ?? []),
      ],
      providesTags: ['Event'],
    }),

    getEventCollections: build.query<CollectionItem[], void>({
      query: () => ({ url: '/event/selections/all', method: 'GET' }),
      transformResponse: (response: { selections: CollectionItem[] }) => response?.selections ?? [],
    }),

    getEventSliderImages: build.query<Banner[], void>({
      query: () => ({ url: '/event/slider/content', method: 'GET' }),
      transformResponse: (response: { sliders: Banner[] }) => response?.sliders ?? [],
    }),

    captureEventSliderClick: build.mutation<void, number>({
      query: (slideId) => ({
        url: `/event/slider/capture/user/click?slideId=${slideId}`,
        method: 'POST',
      }),
    }),

    getEventsList: build.query<any, EventsListParams>({
      queryFn: async (params, _queryApi, _extraOptions, fetchWithBQ) => {
        const requestParams: Record<string, unknown> = {
          searchValue: params.searchValue ?? '',
        };

        if (params.startDate) requestParams.startDate = formatDateWithOnlyDigits(params.startDate);
        if (params.endDate) requestParams.endDate = formatDateWithOnlyDigits(params.endDate);

        if (params.categoryId) {
          requestParams.categoryId = params.categoryId.toString();
          requestParams.innerCategoriesIds = params.innerCategoriesIds ?? undefined;

          const result = await fetchWithBQ({ url: '/event/find', method: 'GET', params: requestParams });
          if (result.error) return { error: result.error };
          return { data: mapEventsList(result.data as ApiEvent[]) };
        }

        const result = await fetchWithBQ({
          url: '/event/find/for/all/categories',
          method: 'GET',
          params: requestParams,
        });
        if (result.error) return { error: result.error };
        return { data: mapEventsCategories(result.data as GroupedApiEventResponse) };
      },
      providesTags: ['Event'],
    }),
  }),
});

export const {
  useGetEventCategoriesQuery,
  useGetEventCollectionsQuery,
  useGetEventSliderImagesQuery,
  useCaptureEventSliderClickMutation,
  useGetEventsListQuery,
} = eventsListApi;
