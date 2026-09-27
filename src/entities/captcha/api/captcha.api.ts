import { baseApi } from '@shared/api/redux.api';
import {
  ICaptchaRequirements,
  IApiCaptchaRequirements,
} from '../types/captcha.types';

/**
 * API для работы с captcha requirements
 */
export const captchaApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /**
     * Получить требования к captcha при входе
     */
    getCaptchaRequirement: build.query<ICaptchaRequirements, void>({
      query: () => ({
        url: '/authentication/captcha/requirement',
        method: 'GET',
      }),
      transformResponse: (response: IApiCaptchaRequirements): ICaptchaRequirements => ({
        captchaRequiredForLogin: response.captchaRequiredForLogin ?? false,
        captchaRequiredForTask: response.captchaRequiredForTask ?? false,
        captchaRequiredForGiveaway: response.captchaRequiredForGiveaway ?? false,
        captchaRequiredForBookingTelegram: response.captchaRequiredForBookingTelegram ?? false,
        captchaRequiredForWaitingListTelegram: response.captchaRequiredForWaitingListTelegram ?? false,
      }),
    }),

    /**
     * Получить требования к captcha для конкретного заведения
     */
    getEstablishmentCaptchaRequirement: build.query<
      { captchaRequiredForBooking: boolean; captchaRequiredForWaitingList: boolean },
      number
    >({
      query: (establishmentId) => ({
        url: `/food/establishments/${establishmentId}/captcha/requirement`,
        method: 'GET',
      }),
      transformResponse: (response: {
        captchaRequiredForBooking?: boolean;
        captchaRequiredForWaitingList?: boolean;
      }) => ({
        captchaRequiredForBooking: response.captchaRequiredForBooking ?? false,
        captchaRequiredForWaitingList: response.captchaRequiredForWaitingList ?? false,
      }),
    }),
  }),
});

export const {
  useGetCaptchaRequirementQuery,
  useLazyGetCaptchaRequirementQuery,
  useGetEstablishmentCaptchaRequirementQuery,
  useLazyGetEstablishmentCaptchaRequirementQuery,
} = captchaApi;

