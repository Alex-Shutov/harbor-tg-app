import { baseApi } from '@shared/api/redux.api';
import { IApiOrder } from '../types/orders.api.types';
import { IOrder } from '../types/orders.types';
import { mapOrderFromApi } from '../mappers';

export const ordersApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getOrders: build.query<IOrder[], { status?: 'WAITING' | 'CONFIRMED' | 'CANCELED' | 'COMPLETED' } | void>({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params && typeof params === 'object' && 'status' in params && params.status) {
          queryParams.append('status', params.status);
        }
        const queryString = queryParams.toString();
        return {
          url: `/account/order/list${queryString ? `?${queryString}` : ''}`,
          method: 'GET',
        };
      },
      transformResponse: (response: IApiOrder[]) => {
        return (response || []).map(mapOrderFromApi);
      },
      providesTags: ['Orders'],
    }),
    cancelOrder: build.mutation<void, { orderId: number; comment: string }>({
      query: ({ orderId, comment }) => ({
        url: `/account/order/${orderId}/cancel`,
        method: 'POST',
        data: { comment },
      }),
      invalidatesTags: ['Orders'],
    }),
  }),
});

export const { useGetOrdersQuery, useCancelOrderMutation } = ordersApi;

