import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';
import { ICartItem, IGroupedCartItems, IGroupedCartByEstablishment } from '../types';

interface ICartState {
  items: ICartItem[];
  unavailableItems: ICartItem[];
  totalItems: number;
  unavailableItemsCount: number;
  groupedByType: IGroupedCartItems | null;
  groupedByEstablishment: IGroupedCartByEstablishment | null;
}

const initialState: ICartState = {
  items: [],
  unavailableItems: [],
  totalItems: 0,
  unavailableItemsCount: 0,
  groupedByType: null,
  groupedByEstablishment: null,
};

const groupCartItems = (items: ICartItem[]): IGroupedCartItems => {
  return {
    urbanboxes: items.filter((item) => item.item.type === 'URBAN_BOX'),
    promocodes: items.filter((item) => item.item.type === 'PROMO_CODE'),
    products: items.filter((item) => item.item.type === 'PRODUCT'),
  };
};

const groupCartByEstablishment = (items: ICartItem[]): IGroupedCartByEstablishment => {
  const grouped: IGroupedCartByEstablishment = {};
  
  items
    .filter((item) => item.item.type === 'URBAN_BOX' && item.item.establishmentId)
    .forEach((item) => {
      const establishmentId = item.item.establishmentId!;
      if (!grouped[establishmentId]) {
        grouped[establishmentId] = {
          establishmentId,
          establishmentTitle: item.item.establishmentTitle || '',
          items: [],
        };
      }
      grouped[establishmentId].items.push(item);
    });
  
  return grouped;
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<ICartItem[]>) => {
      state.items = action.payload;
      state.groupedByType = groupCartItems(action.payload);
      state.groupedByEstablishment = groupCartByEstablishment(action.payload);
    },
    setUnavailableItems: (state, action: PayloadAction<ICartItem[]>) => {
      state.unavailableItems = action.payload;
    },
    setCartStats: (
      state,
      action: PayloadAction<{ totalItems: number; unavailableItemsCount: number }>
    ) => {
      state.totalItems = action.payload.totalItems;
      state.unavailableItemsCount = action.payload.unavailableItemsCount;
    },
    updateCartItem: (state, action: PayloadAction<{ cartItemId: number; quantity: number }>) => {
      const { cartItemId, quantity } = action.payload;
      const item = state.items.find((item) => item.cartItemId === cartItemId);
      if (item) {
        item.quantity = quantity;
        state.groupedByType = groupCartItems(state.items);
        state.groupedByEstablishment = groupCartByEstablishment(state.items);
      }
    },
    removeCartItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.cartItemId !== action.payload);
      state.groupedByType = groupCartItems(state.items);
      state.groupedByEstablishment = groupCartByEstablishment(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      state.unavailableItems = [];
      state.totalItems = 0;
      state.unavailableItemsCount = 0;
      state.groupedByType = null;
      state.groupedByEstablishment = null;
    },
  },
});

export const {
  setCart,
  setUnavailableItems,
  setCartStats,
  updateCartItem,
  removeCartItem,
  clearCart,
} = cartSlice.actions;

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectUnavailableItems = (state: RootState) => state.cart.unavailableItems;
export const selectCartTotalItems = (state: RootState) => state.cart.totalItems;
export const selectGroupedCartByType = (state: RootState) => state.cart.groupedByType;
export const selectGroupedCartByEstablishment = (state: RootState) =>
  state.cart.groupedByEstablishment;
export const selectCartItemsByEstablishment = (establishmentId: number) => (state: RootState) =>
  state.cart.groupedByEstablishment?.[establishmentId]?.items || [];

export default cartSlice.reducer;


