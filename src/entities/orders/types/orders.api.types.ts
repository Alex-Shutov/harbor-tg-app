import { ICartItem } from '@/entities/shop/types/store.types';

export type IOrderStatus = 'WAITING' | 'CONFIRMED' | 'CANCELED' | 'COMPLETED';

export type EOrderType = 'URBAN_BOX' | 'PROMO_CODE' | 'PRODUCT';

// Базовый интерфейс заказа
export interface IApiAbstractOrder {
  id: number;
  createdAt: string;
  updatedAt: string;
  status: IOrderStatus;
  items: ICartItem[];
  type: EOrderType;
  totalAmount: number;
}

// Заказ наборов
export interface IApiUrbanBoxOrder extends IApiAbstractOrder {
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
export interface IApiPromoCodeOrder extends IApiAbstractOrder {
  type: 'PROMO_CODE';
}

// Заказ товаров
export interface IApiProductOrder extends IApiAbstractOrder {
  type: 'PRODUCT';
  pickupLocation: string;
  contactUsername: string;
}

// Объединенный тип заказа
export type IApiOrder = IApiUrbanBoxOrder | IApiPromoCodeOrder | IApiProductOrder;


