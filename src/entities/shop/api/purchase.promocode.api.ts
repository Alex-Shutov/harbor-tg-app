import { baseApi } from '@shared/api/redux.api.ts';
import { IPromoCodeListResponse, IPromoCodePurchaseRequest } from '@/entities/shop/types';
import { mapPromoCodeFromApi } from '@/entities/promocode/mappers';
import { IPromoCode } from '@/entities/promocode/types';

export const shopApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPromoCodesList: build.query<IPromoCode[], void>({
      query: () => ({
        url: '/account/promo/code/store/list',
        method: 'GET',
      }),
      transformResponse: (response: IPromoCodeListResponse):IPromoCode[] => {
        debugger;
        return response.items.map(mapPromoCodeFromApi);
      },
      providesTags: ['PromoCodes'],
    }),

    purchasePromoCode: build.mutation<
      IPromoCode,
      IPromoCodePurchaseRequest
    >({
      query: (body) => ({
        url: '/account/promo/code/store/purchase',
        method: 'POST',
        data:body,
      }),
      invalidatesTags: ['PromoCodes', 'UserBalance'],
    }),
  }),
});

export const { useGetPromoCodesListQuery, usePurchasePromoCodeMutation } = shopApi;