import { baseApi } from '@shared/api/redux.api';
import { IApiTransaction, ITransaction } from '../types';
import { mapTransactionFromApi } from '../mappers';

export const transactionsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTransactions: build.query<ITransaction[], void>({
      query: () => ({
        url: '/account/transactions',
        method: 'GET',
      }),
      transformResponse: (response: IApiTransaction[]): ITransaction[] => {
        return (response || []).map(mapTransactionFromApi);
      },
      providesTags: ['Transactions'],
    }),
  }),
});

export const { useGetTransactionsQuery } = transactionsApi;

