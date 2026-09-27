import { IOrderStatus, EOrderType } from './orders.api.types';
import { ICartItem } from '@/entities/shop/types/store.types';

// Базовый интерфейс заказа
export interface IAbstractOrder {
  id: number;
  createdAt: string;
  updatedAt: string;
  status: IOrderStatus;
  items: ICartItem[];
  type: EOrderType;
  totalAmount: number;
}

// Заказ наборов
export interface IUrbanBoxOrder extends IAbstractOrder {
  type: 'URBAN_BOX';
  establishmentId: number;
  establishmentTitle: string;
  saleTimeStart: string;
  saleTimeEnd: string;
  pickupLocation: string;
  userPhone: string;
  verificationCode: string;
  comment?: string;
}

// Заказ промокодов
export interface IPromoCodeOrder extends IAbstractOrder {
  type: 'PROMO_CODE';
}

// Заказ товаров
export interface IProductOrder extends IAbstractOrder {
  type: 'PRODUCT';
  pickupLocation: string;
  contactUsername: string;
}

// Объединенный тип заказа
export type IOrder = IUrbanBoxOrder | IPromoCodeOrder | IProductOrder;


