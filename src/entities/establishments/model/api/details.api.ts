import { IEstablishmentDetails } from '../types/details.domain.types';
import { IApiEstablishment } from '../types/details.api.types';
import { mapEstablishmentFromApi } from '../mappers/details.mapper';
import { baseApi } from '@shared/api/redux.api.ts';

export const detailsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getEstablishment: build.query<IEstablishmentDetails, number>({
      async queryFn(id, _queryApi, _extraOptions, fetchWithBQ) {
        const establishmentResult = await fetchWithBQ({
          url: `/food/establishments/get?id=${id}`,
          method: 'GET',
        });

        if (establishmentResult.error) {
          return { error: establishmentResult.error };
        }

        const establishmentData = establishmentResult.data as IApiEstablishment;
        const mappedData = mapEstablishmentFromApi(establishmentData);

        return { data: mappedData };
      },
      providesTags: (result) => [{ type: 'Establishment', id: result?.id }],
    }),
  }),
});

export const { useGetEstablishmentQuery } = detailsApi;
