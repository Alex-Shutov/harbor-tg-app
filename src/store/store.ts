import { configureStore } from '@reduxjs/toolkit';
import { baseApi } from '@/shared/api/redux.api.ts';
import { establishmentDetailsReducer } from '@/entities/establishments/model/store/details.slice.ts';
import { eventDetailsReducer } from '@/entities/events/model/store/details.slice.ts';
import { filterEstablishmentsReducer } from '@/entities/establishments/model/store';
import filterEventsReducer from '@/entities/events/model/store/filters.slice.ts';
import filterLeisuresReducer from '@/entities/leisures/model/store/filters.slice.ts';
import filterFavoritesReducer from '@/entities/favorites/model/store/filters.slice.ts';
import { userBalanceReducer } from '@/entities/user-balance/model';
import { appliedPromocodesReducer } from '@/entities/promocode/model/appliedPromocodes.slice';
import shopReducer from '@/entities/shop/model/shop.slice';
import cartReducer from '@/entities/shop/model/cart.slice';
import { favoritesReducer } from '@/features/spot-card/manageLike/model/store/favorites.slice.ts';
import { captchaReducer } from '@/entities/captcha/store/captcha.store';
import { accountReducer } from '@/entities/account/model/account.slice';
import { uiReducer } from '@/entities/ui/model/ui.slice';

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    establishmentDetails: establishmentDetailsReducer,
    eventDetails: eventDetailsReducer,
    filterEstablishments: filterEstablishmentsReducer,
    filterEvents: filterEventsReducer,
    filterLeisures: filterLeisuresReducer,
    filterFavorites: filterFavoritesReducer,
    userBalance: userBalanceReducer,
    appliedPromocodes: appliedPromocodesReducer,
    shop: shopReducer,
    cart: cartReducer,
    favorites: favoritesReducer,
    captcha: captchaReducer,
    account: accountReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
