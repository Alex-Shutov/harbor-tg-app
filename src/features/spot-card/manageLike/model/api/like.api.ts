import { baseApi } from '@shared/api/redux.api.ts';
import { IToggleFavoriteArg, IToggleFavoriteResponse } from '@/features/spot-card/manageLike/model/types/favorites.types.ts';

export const favoritesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    toggleFavorite: build.mutation({
      query: (arg: IToggleFavoriteArg) => ({
        url: '/favorite/add/or/remove',
        method: 'POST',
        params: arg
      }),
      transformResponse: (response: IToggleFavoriteResponse) => {
        return response;
      },
      invalidatesTags: ['Favorites'],
    }),
  }),
});


export const { useToggleFavoriteMutation } = favoritesApi;
