import { IApiOrder, IApiUrbanBoxOrder, IApiProductOrder } from '../types/orders.api.types';
import { IOrder, IUrbanBoxOrder, IPromoCodeOrder, IProductOrder } from '../types/orders.types';
import { mapStoreItemFromApi } from '@/entities/shop/mappers/store.mapper';
import { ICartItem } from '@/entities/shop/types/store.types';

// Маппинг элемента корзины из заказа
const mapCartItemFromOrder = (apiCartItem: any): ICartItem => {
  return {
    cartItemId: apiCartItem.cartItemId,
    item: mapStoreItemFromApi(apiCartItem.item),
    quantity: apiCartItem.quantity,
    available: apiCartItem.available,
    unavailabilityReason: apiCartItem.unavailabilityReason,
  };
};

export const mapOrderFromApi = (apiOrder: IApiOrder): IOrder => {
  const baseOrder = {
    id: apiOrder.id,
    createdAt: apiOrder.createdAt,
    updatedAt: apiOrder.updatedAt,
    status: apiOrder.status,
    items: (apiOrder.items || []).map(mapCartItemFromOrder),
    type: apiOrder.type,
    totalAmount: apiOrder.totalAmount || 0,
  };

  switch (apiOrder.type) {
    case 'URBAN_BOX': {
      const urbanBoxOrder = apiOrder as IApiUrbanBoxOrder;
      return {
        ...baseOrder,
        type: 'URBAN_BOX',
        establishmentId: urbanBoxOrder.establishmentId,
        establishmentTitle: urbanBoxOrder.establishmentTitle,
        saleTimeStart: urbanBoxOrder.saleTimeStart,
        saleTimeEnd: urbanBoxOrder.saleTimeEnd,
        pickupLocation: urbanBoxOrder.pickupLocation,
        userPhone: urbanBoxOrder.userPhone,
        verificationCode: urbanBoxOrder.verificationCode,
        comment: urbanBoxOrder.comment,
      } as IUrbanBoxOrder;
    }
    case 'PROMO_CODE': {
      return {
        ...baseOrder,
        type: 'PROMO_CODE',
      } as IPromoCodeOrder;
    }
    case 'PRODUCT': {
      const productOrder = apiOrder as IApiProductOrder;
      return {
        ...baseOrder,
        type: 'PRODUCT',
        pickupLocation: productOrder.pickupLocation,
        contactUsername: productOrder.contactUsername,
      } as IProductOrder;
    }
    default:
      throw new Error(`Unknown order type: ${(apiOrder as any).type}`);
  }
};


