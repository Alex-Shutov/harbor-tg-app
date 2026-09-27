import { ILeisureDetails } from '../types/details.domain.types';
import { IApiLeisureDetails } from '../types/details.api.types';
import { mapLeisureFromApi } from '../mappers/details.mapper';
import { baseApi } from '@shared/api/redux.api';

export const leisuresDetailsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getLeisure: build.query<ILeisureDetails, number>({
      query: (id: number) => ({
        url: `/leisure/get?id=${id}`,
        method: 'GET',
      }),
      transformResponse: (response: IApiLeisureDetails): ILeisureDetails =>
        mapLeisureFromApi(response),
      providesTags: (result) => [{ type: 'Leisure', id: result?.id }],
    }),

    receiveLeisurePromoCode: build.mutation<
      ILeisureDetails,
      { id: number; promoCodeId: number }
    >({
      query: (args) => ({
        url: '/leisure/receive/or/buy/promo/code',
        method: 'POST',
        params: { id: args.id, promoCodeId: args.promoCodeId },
      }),
      transformResponse: (response: IApiLeisureDetails): ILeisureDetails =>
        mapLeisureFromApi(response),
      invalidatesTags: (__, _, args) => [
        { type: 'Leisure', id: args.id },
      ],
    }),
  }),
});

export const { useGetLeisureQuery, useReceiveLeisurePromoCodeMutation } =
  leisuresDetailsApi;
