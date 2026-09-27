import { baseApi } from '@shared/api/redux.api.ts';
import { ApiEstablishment, mapEstablishmentList } from '@pages/Establishments/main.mapper.ts';
import { ApiEvent, mapEventsList } from '@pages/Events/events.mapper.ts';
import { FavoritesResponse, mapFavorites } from '@pages/Account/components/Favorites/favorites.mapper.ts';
import { Category } from '@pages/Establishments/components/CategoriesBar/categroies.atoms.ts';

const allFavoriteCategory: Category = {
  id: 0,
  title: 'Все',
  serialNumber: 0,
};

export interface FavoritesListParams {
  categoryId: number;
  categoryType: 'ESTABLISHMENT' | 'EVENT' | 'LEISURE' | '';
}

export const favoritesListApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getFavoriteCategories: build.query<Category[], 'ESTABLISHMENT' | 'EVENT' | 'LEISURE' | null>({
      query: (type) => ({
        url: '/account/favorite/categories',
        method: 'GET',
        params: type ? { type } : {},
      }),
      transformResponse: (response: Category[]) => [allFavoriteCategory, ...(response ?? [])],
      providesTags: ['Favorites'],
    }),

    getFavorites: build.query<any, FavoritesListParams>({
      queryFn: async (params, _queryApi, _extraOptions, fetchWithBQ) => {
        const requestParams = {
          categoryId: params.categoryId.toString(),
          categoryType: params.categoryType,
        };

        if (params.categoryId) {
          const result = await fetchWithBQ({ url: '/account/favorite/find', method: 'GET', params: requestParams });
          if (result.error) return { error: result.error };

          switch (params.categoryType) {
            case 'ESTABLISHMENT':
              return { data: mapEstablishmentList(result.data as ApiEstablishment[]) };
            case 'EVENT':
              return { data: mapEventsList(result.data as ApiEvent[]) };
            case 'LEISURE':
              return { data: mapEstablishmentList(result.data as ApiEstablishment[], 'LEISURE') };
            default:
              return { data: mapEstablishmentList(result.data as ApiEstablishment[]) };
          }
        }

        const result = await fetchWithBQ({
          url: '/account/favorite/find/for/all/categories',
          method: 'GET',
          params: requestParams,
        });
        if (result.error) return { error: result.error };
        return { data: mapFavorites(result.data as FavoritesResponse) };
      },
      providesTags: ['Favorites'],
    }),
  }),
});

export const { useGetFavoriteCategoriesQuery, useGetFavoritesQuery } = favoritesListApi;
