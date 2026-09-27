import { baseApi } from '@shared/api/redux.api';
import { IUserBalance } from '../types/user-balance.types';

export const userBalanceApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getUserBalance: build.query<IUserBalance, void>({
      query: () => ({
        url: '/user/info',
        method: 'GET',
      }),
      providesTags: ['UserBalance'],
    }),
  }),
});

export const { useGetUserBalanceQuery } = userBalanceApi;
