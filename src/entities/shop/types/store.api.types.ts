import { EStoreItemType } from './store.types';

export interface IApiStoreImage {
  id: number;
  url: string;
}

export interface IApiStoreItem {
  id: number;
  title: string;
  description: string;
  mainImage?: IApiStoreImage; // Опционально, т.к. в заказах может не быть
  additionalImages?: IApiStoreImage[];
  status?: 'ACTIVE' | 'INACTIVE'; // Опционально для элементов в заказах
  type: EStoreItemType;
  cost?: number;
  // Для наборов
  priceActual?: number;
  priceCustomer?: number;
  availableQuantity?: number;
  publicationId?: number;
  onePerHand?: boolean;
  saleTimeStart?: string;
  saleTimeEnd?: string;
  // Для промокодов
  code?: string;
  allowReuse?: boolean;
  objectType?: string;
  objectId?: number;
  objectTitle?: string;
  startDate?: string;
  endDate?: string;
  amount?: number;
  appliedCount?: number;
  receivedCount?: number;
  useOrGetType?: string;
  // Общие поля
  pickupLocation?: string;
  contactUsername?: string;
  establishmentId?: number;

  establishmentTitle?: string;
  pickupHours?: string;
  promoCodeType?: string;
}

export interface IApiStoreItemResponse {
  items: IApiStoreItem[];
}

