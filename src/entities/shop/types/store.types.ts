export enum EStoreItemType {
  URBAN_BOX = 'URBAN_BOX',
  PROMO_CODE = 'PROMO_CODE',
  PRODUCT = 'PRODUCT',
}

export enum EUnavailabilityReason {
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  NOT_AVAILABLE = 'NOT_AVAILABLE',
}

export interface IStoreImage {
  id: number;
  url: string;
}

export interface IStoreItem {
  id: number;
  title: string;
  description: string;
  mainImage: IStoreImage;
  additionalImages: IStoreImage[];
  status: 'ACTIVE' | 'INACTIVE';
  type: EStoreItemType;
  cost: number;
  // Для наборов
  priceActual?: number;
  priceCustomer?: number;
  // Общие поля
  pickupLocation?: string;
  contactUsername?: string;
  availableQuantity?: number;
  onePerHand: boolean;
  establishmentId?: number;
  establishmentTitle?: string;
  pickupHours?: string;
  promoCodeType?: string;
  objectId?: number;
  objectTitle?: string;
}

export interface IStoreItemResponse {
  items: IStoreItem[];
}

export interface ICartItem {
  cartItemId: number;
  item: IStoreItem;
  quantity: number;
  available: boolean;
  unavailabilityReason?: EUnavailabilityReason;
}

export interface ICartResponse {
  items: ICartItem[];
  totalItems: number;
  unavailableItems: ICartItem[];
  unavailableItemsCount: number;
}

export interface IGroupedCartItems {
  urbanboxes: ICartItem[];
  promocodes: ICartItem[];
  products: ICartItem[];
}

export interface IGroupedCartByEstablishment {
  [establishmentId: number]: {
    establishmentId: number;
    establishmentTitle: string;
    items: ICartItem[];
  };
}

