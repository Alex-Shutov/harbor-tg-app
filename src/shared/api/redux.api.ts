import {
  createApi,
  type BaseQueryFn,
} from '@reduxjs/toolkit/query/react';
import type { AxiosError, AxiosRequestConfig } from 'axios';
import { apiClient } from '@shared/api/reduxClient.ts';
import { enumTransformer } from '@shared/middleware';

export interface IBaseQueryArgs extends AxiosRequestConfig {
  url: string;
}

export interface IBaseQueryError {
  status?: number;
  data?: any;
  message?: string;
}

const axiosBaseQuery: BaseQueryFn<
  IBaseQueryArgs,
  unknown,
  IBaseQueryError,
  Record<string, unknown>,
  Record<string, unknown>
> = async (args) => {
  try {
    const transformedArgs = enumTransformer(args);
    const result = await apiClient({
      ...transformedArgs,
    });
    return { data: result.data };
  } catch (error) {
    const axiosError = error as AxiosError;
    return {
      error: {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        message: axiosError.message,
      },
    };
  }
};

/**
 * Главный API instance с axios baseQuery
 */
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery,

  tagTypes: ['Establishment', 'Event', 'Leisure', 'Favorites', 'UserBalance', 'PromoCode','PromoCodes','PromoCodeCategories','PromoCodeUse', 'GiveawayList', 'Transactions', 'Tasks','ReferralSystem', 'Urbanbox', 'UrbanboxCart', 'UrbanboxOrders','Commission', 'Store', 'Cart', 'Orders'],
  endpoints: () => ({}),
});
