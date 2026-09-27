import { baseApi } from '@shared/api/redux.api';
import { EPageType } from '@shared/constants/types.constants';
import {
  ICheckPromoCodeResponse,
  IPromoCode,
  IPromoCodeCategoriesResponse,
  IPromoCodeResponse,
} from '@/entities/promocode/types';
import { mapPromoCodeFromApi } from '@/entities/promocode/mappers';
import { IApiCategory, IApiPromoCode } from '@shared/types';

export const promocodeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPromoCodes: build.query<
      IPromoCodeResponse,
      { categoryId?: number; type?: EPageType }
    >({
      query: ({ categoryId, type }) => {
        const params: Record<string, any> = {};
        if (categoryId) params.categoryId = categoryId;
        if (type) params.type = type;

        return {
          url: '/account/promo/code/find',
          method: 'GET',
          params,
        };
      },
      transformResponse: (response: any) => ({
        active: (response.active || []).map(mapPromoCodeFromApi),
        completed: (response.completed || []).map(mapPromoCodeFromApi),
        used: (response.used || []).map(mapPromoCodeFromApi),
      }),
      providesTags: ['PromoCode'],
    }),
    getPromoCodeCategories: build.query<
      IApiCategory[],
      void
    >({
      query: () => ({
        url: '/account/promo/code/categories',
        method: 'GET',
      }),
      transformResponse: (response: IPromoCodeCategoriesResponse): IApiCategory[] => {
        const allCategories = [
          ...response.establishments,
          ...response.events,
          ...response.leisure,
        ];


        return [
          { id: 0, title: 'Все', serialNumber: 0,
          } as IApiCategory,
          ...allCategories,
        ];
      },
      // queryFn: () => {
      //   const allCategories = [
      //     ...mockPromoCodeCategories.establishmentCategories,
      //     ...mockPromoCodeCategories.eventCategories,
      //     ...mockPromoCodeCategories.leisureCategories,
      //   ];
      //   return {
      //     data: [
      //       { id: 0, title: 'Все', serialNumber: 0 },
      //       ...allCategories,
      //     ],
      //   };
      // },
      providesTags: ['PromoCodeCategories'],
    }),

    checkPromoCode: build.mutation<
      ICheckPromoCodeResponse,
      {
        targetId: number;
        promoCodeStr: string;
        type: EPageType;
      }
    >({
      query: ({ targetId, promoCodeStr, type }) => {
        const pathMap: { [EPageType.ESTABLISHMENT]: string; [EPageType.EVENT]: string; [EPageType.LEISURE]: string } = {
          [EPageType.ESTABLISHMENT]: `/food/establishments/check/${targetId}/promo/code`,
          [EPageType.EVENT]: `/events/check/${targetId}/promo/code`,
          [EPageType.LEISURE]: `/leisures/check/${targetId}/promo/code`,
        };

        if (type === EPageType.ESTABLISHMENT || type === EPageType.EVENT || type === EPageType.LEISURE) {
          return {
            url: pathMap[type],
            method: 'POST',
            params: { promoCodeStr },
          };
        }

        throw new Error(`Unsupported page type: ${type}`);
      },
      // async queryFn({ promoCodeStr }) {
      //   if (promoCodeStr === 'TEST') {
      //     return { data: { success: true } };
      //   }
      //   return {
      //     error: {
      //       status: 400,
      //       data: { message: 'Неверный код' },
      //     },
      //   };
      // },
      invalidatesTags: ['PromoCode'],
    }),

    receivePromoCode: build.mutation<
      any,
      {
        targetId: number;
        promoCodeId: number;
        type: EPageType;
      }
    >({
      query: ({ targetId, promoCodeId, type }) => {
        const pathMap: Record<string, string> = {
          [EPageType.ESTABLISHMENT.toUpperCase()]: `/food/establishments/receive/or/buy/promo/code`,
          [EPageType.EVENT.toUpperCase()]: `/event/receive/or/buy/promo/code`,
          [EPageType.LEISURE.toUpperCase()]: `/leisure/receive/or/buy/promo/code`,
        };

        return {
          url: pathMap[type],
          method: 'POST',
          params: { id: targetId, promoCodeId },
          data:{}
        };
      },
      transformResponse: (response: IApiPromoCode): IPromoCode => mapPromoCodeFromApi(response),
      // async queryFn({ promoCodeId }) {
      //   const promo = mockActivePromoCodes.find(p => p.id === promoCodeId);
      //   if (promo) {
      //     return { data: mapPromoCodeFromApi(promo) };
      //   }
      //   return {
      //     error: {
      //       status: 404,
      //       data: { message: 'Промокод не найден' },
      //     },
      //   };
      // },
      invalidatesTags: (_, __, args) => {
        const tags: any[] = ['PromoCode'];
        // Инвалидируем теги объекта для автоматического обновления данных
        if (args.type === EPageType.ESTABLISHMENT) {
          tags.push({ type: 'Establishment', id: args.targetId });
        } else if (args.type === EPageType.EVENT) {
          tags.push({ type: 'Event', id: args.targetId });
        } else if (args.type === EPageType.LEISURE) {
          tags.push({ type: 'Leisure', id: args.targetId });
        }
        return tags;
      },
    }),

    usePromoCode: build.mutation<
      ICheckPromoCodeResponse,
      {
        receivedPromoCodeId: number;
        promoCodeType: EPageType;
        verificationCode: string;
        objectId?: number;
      }
    >({
      query: (body) => {
        const { objectId, ...rest } = body;
        return {
          url: '/account/promo/code/use',
          method: 'POST',
          data: rest,
        };
      },
      // async queryFn({ verificationCode }) {
      //   if (verificationCode === '1234') {
      //     return { data: { success: true } };
      //   }
      //   return {
      //     error: {
      //       status: 400,
      //       data: { message: 'Неверный код проверки' },
      //     },
      //   };
      // },
      invalidatesTags: (_, __, args) => {
        const tags: any[] = ['PromoCode'];
        // Инвалидируем теги объекта для автоматического обновления данных
        if (args.objectId) {
          if (args.promoCodeType === EPageType.ESTABLISHMENT) {
            tags.push({ type: 'Establishment', id: args.objectId });
          } else if (args.promoCodeType === EPageType.EVENT) {
            tags.push({ type: 'Event', id: args.objectId });
          } else if (args.promoCodeType === EPageType.LEISURE) {
            tags.push({ type: 'Leisure', id: args.objectId });
          }
        }
        return tags;
      },
    }),
  }),
});

export const {
  useGetPromoCodesQuery,
  useGetPromoCodeCategoriesQuery,
  useCheckPromoCodeMutation,
  useReceivePromoCodeMutation,
  useUsePromoCodeMutation,
} = promocodeApi;
