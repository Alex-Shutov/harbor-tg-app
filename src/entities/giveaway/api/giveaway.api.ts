import { baseApi } from '@shared/api/redux.api';
import {
  IApiGiveawayListResponse,
  IGiveaway,
  IGiveawayListResponse,
  IParticipateInGiveawayRequest,
  IParticipateInGiveawayResponse,
} from '../types';
import { mapGiveawayFromApi } from '../mappers';

export const giveawayApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getGiveawaysList: build.query<IGiveawayListResponse, void>({
      query: () => ({
        url: '/account/giveaway/list',
        method: 'GET',

      }),
      transformResponse: (response: IApiGiveawayListResponse): IGiveawayListResponse => ({
        active: (response.active || []).map(mapGiveawayFromApi),
        participating: (response.participating || []).map(mapGiveawayFromApi),
        completed: (response.completed || []).map(mapGiveawayFromApi),
        prizes: (response.prizes || []).map(mapGiveawayFromApi),
      }),
      providesTags: ['GiveawayList'],
    }),

    participateInGiveaway: build.mutation<IGiveaway, IParticipateInGiveawayRequest>({
      query: (body) => ({
        url: '/account/giveaway/participate',
        method: 'POST',
        data: body,
      }),
      transformResponse: (response: IParticipateInGiveawayResponse): IGiveaway => {
        return mapGiveawayFromApi(response.telegramGiveawayDetailedInfoDto);
      },
      invalidatesTags: ['GiveawayList'],
    })
  }),
});

export const { useGetGiveawaysListQuery, useParticipateInGiveawayMutation } = giveawayApi;
























