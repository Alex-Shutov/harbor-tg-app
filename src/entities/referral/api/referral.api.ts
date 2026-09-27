import { baseApi } from '@shared/api/redux.api';
import { IReferralSystemInfo } from '@/entities/referral';

export const referralApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getReferralSystemInfo: build.query<IReferralSystemInfo, void>({
      query: () => ({
        url: '/account/task/referral-system',
        method: 'GET',
      }),
      providesTags: ['ReferralSystem'],
    }),
  }),
});

export const { useGetReferralSystemInfoQuery } = referralApi;


