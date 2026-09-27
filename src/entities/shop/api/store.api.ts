import { baseApi } from '@shared/api/redux.api.ts';
import {
  IStoreItem,
  EStoreItemType,
  ICartResponse,
  ICartItem,
} from '../types';
import { IApiStoreItemResponse } from '../types/store.api.types';
import { mapStoreItemFromApi } from '../mappers/store.mapper';
import { IApiStoreItem } from '../types/store.api.types';

export const storeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getStoreList: build.query<IStoreItem[], { type?: EStoreItemType } | void>({
      query: (params) => {
        const queryParams = params?.type ? `?type=${params.type}` : '';
        return {
          url: `/account/store/list${queryParams}`,
          method: 'GET',
        };
      },
      transformResponse: (response: IApiStoreItemResponse): IStoreItem[] => {
        return (response.items || []).map(mapStoreItemFromApi);
      },
      providesTags: ['Store'],
    }),

    getCartInfo: build.query<ICartResponse, void>({
      query: () => ({
        url: '/account/cart/info',
        method: 'GET',
      }),
      transformResponse: (response: any): ICartResponse => {
        // Маппим элементы корзины
        const items: ICartItem[] = (response.items || []).map((apiCartItem: any) => ({
          cartItemId: apiCartItem.cartItemId,
          item: mapStoreItemFromApi(apiCartItem.item as IApiStoreItem),
          quantity: apiCartItem.quantity,
          available: apiCartItem.available,
          unavailabilityReason: apiCartItem.unavailabilityReason,
        }));
        
        // Маппим недоступные элементы
        const unavailableItems: ICartItem[] = (response.unavailableItems || []).map((apiCartItem: any) => ({
          cartItemId: apiCartItem.cartItemId,
          item: mapStoreItemFromApi(apiCartItem.item as IApiStoreItem),
          quantity: apiCartItem.quantity,
          available: false,
          unavailabilityReason: apiCartItem.unavailabilityReason,
        }));
        
        return {
          items,
          totalItems: response.totalItems || 0,
          unavailableItems,
          unavailableItemsCount: response.unavailableItemsCount || 0,
        };
      },
      providesTags: ['Cart'],
    }),

    addToCart: build.mutation<ICartResponse, { itemId: number; quantity: number, itemType:EStoreItemType   }>({
      query: (body) => ({
        url: '/account/cart/add',
        method: 'POST',
        data: body,
      }),
      transformResponse: (response: any): ICartResponse => {
        // Маппим элементы корзины
        const items: ICartItem[] = (response.items || []).map((apiCartItem: any) => ({
          cartItemId: apiCartItem.cartItemId,
          item: mapStoreItemFromApi(apiCartItem.item as IApiStoreItem),
          quantity: apiCartItem.quantity,
          available: apiCartItem.available,
          unavailabilityReason: apiCartItem.unavailabilityReason,
        }));
        
        // Маппим недоступные элементы
        const unavailableItems: ICartItem[] = (response.unavailableItems || []).map((apiCartItem: any) => ({
          cartItemId: apiCartItem.cartItemId,
          item: mapStoreItemFromApi(apiCartItem.item as IApiStoreItem),
          quantity: apiCartItem.quantity,
          available: false,
          unavailabilityReason: apiCartItem.unavailabilityReason,
        }));
        
        return {
          items,
          totalItems: response.totalItems || 0,
          unavailableItems,
          unavailableItemsCount: response.unavailableItemsCount || 0,
        };
      },
      invalidatesTags: ['Cart', 'UserBalance'],
    }),

    removeFromCart: build.mutation<ICartResponse, { cartItemId: number }>({
      query: (body) => ({
        url: '/account/cart/remove',
        method: 'DELETE',
        data: body,
      }),
      transformResponse: (response: any): ICartResponse => {
        // Маппим элементы корзины
        const items: ICartItem[] = (response.items || []).map((apiCartItem: any) => ({
          cartItemId: apiCartItem.cartItemId,
          item: mapStoreItemFromApi(apiCartItem.item as IApiStoreItem),
          quantity: apiCartItem.quantity,
          available: apiCartItem.available,
          unavailabilityReason: apiCartItem.unavailabilityReason,
        }));
        
        // Маппим недоступные элементы
        const unavailableItems: ICartItem[] = (response.unavailableItems || []).map((apiCartItem: any) => ({
          cartItemId: apiCartItem.cartItemId,
          item: mapStoreItemFromApi(apiCartItem.item as IApiStoreItem),
          quantity: apiCartItem.quantity,
          available: false,
          unavailabilityReason: apiCartItem.unavailabilityReason,
        }));
        
        return {
          items,
          totalItems: response.totalItems || 0,
          unavailableItems,
          unavailableItemsCount: response.unavailableItemsCount || 0,
        };
      },
      invalidatesTags: ['Cart'],
    }),

    decreaseCartItem: build.mutation<ICartResponse, { cartItemId: number; decreaseBy: number }>({
      query: (body) => ({
        url: '/account/cart/decrease',
        method: 'PUT',
        data: body,
      }),
      transformResponse: (response: any): ICartResponse => {
        // Маппим элементы корзины
        const items: ICartItem[] = (response.items || []).map((apiCartItem: any) => ({
          cartItemId: apiCartItem.cartItemId,
          item: mapStoreItemFromApi(apiCartItem.item as IApiStoreItem),
          quantity: apiCartItem.quantity,
          available: apiCartItem.available,
          unavailabilityReason: apiCartItem.unavailabilityReason,
        }));
        
        // Маппим недоступные элементы
        const unavailableItems: ICartItem[] = (response.unavailableItems || []).map((apiCartItem: any) => ({
          cartItemId: apiCartItem.cartItemId,
          item: mapStoreItemFromApi(apiCartItem.item as IApiStoreItem),
          quantity: apiCartItem.quantity,
          available: false,
          unavailabilityReason: apiCartItem.unavailabilityReason,
        }));
        
        return {
          items,
          totalItems: response.totalItems || 0,
          unavailableItems,
          unavailableItemsCount: response.unavailableItemsCount || 0,
        };
      },
      invalidatesTags: ['Cart'],
    }),

    createOrder: build.mutation<any, { cartItemIds: number[] }>({
      query: (body) => ({
        url: '/account/order/create',
        method: 'POST',
        data: body,
      }),
      invalidatesTags: ['Cart', 'UserBalance', 'Orders'],
    }),
  }),
});

export const {
  useGetStoreListQuery,
  useGetCartInfoQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
  useDecreaseCartItemMutation,
  useCreateOrderMutation,
} = storeApi;

