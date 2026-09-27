import { IEventDetails } from '../types/details.domain.types.ts';
import { IApiEventDetails } from '../types/details.api.types.ts';
import { mapEventFromApi } from '../mappers/details.mapper.ts';
import { baseApi } from '@shared/api/redux.api.ts';

export const eventsDetailsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getEvent: build.query<IEventDetails, number>({
      query: (id: number) => ({
        url: `/event/get?id=${id}`,
        method: 'GET',
      }),
      transformResponse: (response: IApiEventDetails): IEventDetails =>
        mapEventFromApi(response),
      providesTags: (result) => [{ type: 'Event', id: result?.id }],
    }),

    receiveEventPromoCode: build.mutation<
      IEventDetails,
      { id: number; promoCodeId: number }
    >({
      query: (args) => ({
        url: '/event/receive/or/buy/promo/code',
        method: 'POST',
        params: { id: args.id, promoCodeId: args.promoCodeId },
      }),
      transformResponse: (response: IApiEventDetails): IEventDetails =>
        mapEventFromApi(response),
      invalidatesTags: (_, __, args) => [
        { type: 'Event', id: args.id },
      ],
    }),
  }),
});

export const { useGetEventQuery, useReceiveEventPromoCodeMutation } =
  eventsDetailsApi;
