import { baseApi } from '@shared/api/redux.api';
import {
  IApiTransferBonusesRequest,
  IApiUserTagResponse,
  ITransferBonusesRequest,
  ITransferBonusesResponse,
  IUserTag,
} from '../types/transfer.types';
import { mapUserTagFromApi } from '../mappers/transfer.mapper';

export const transferBonusesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    searchUserTags: build.query<IUserTag[], string>({
      query: (searchQuery: string) => {
        const username = searchQuery.trim().startsWith('@') 
          ? searchQuery.trim().substring(1) 
          : searchQuery.trim();
        
        return {
          url: '/transaction/payment/users',
          method: 'GET',
          params: {
            username,
          },
        };
      },
      transformResponse: (response: IApiUserTagResponse[]): IUserTag[] => {
        return (response || []).map(mapUserTagFromApi);
      },
    }),
    getComission: build.query<number,void>({
      query: () => ({
        url: `/transaction/payment/commison`,
        method: 'GET',
      }),
      providesTags: ['Commission'],
    }),

    transferBonuses: build.mutation<
      ITransferBonusesResponse,
      ITransferBonusesRequest
    >({
      query: (request: ITransferBonusesRequest) => {
        const apiRequest: IApiTransferBonusesRequest = {
          toUsername: request.recipientTag,
          amount: request.amount,
          description: request.description,
        };
        return {
          url: '/transaction/payment/user',
          method: 'POST',
          data: apiRequest,
        };
      },
      invalidatesTags: ['UserBalance', 'Transactions'],
    }),
  }),


});

export const {
  useLazySearchUserTagsQuery,
  useGetComissionQuery,
  useTransferBonusesMutation,
} = transferBonusesApi;


