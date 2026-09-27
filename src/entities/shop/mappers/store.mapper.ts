import { IStoreItem, IStoreImage } from '../types';
import { IApiStoreItem, IApiStoreImage } from '../types/store.api.types';

const mapStoreImage = (apiImage: IApiStoreImage): IStoreImage => ({
  id: apiImage.id,
  url: apiImage.url,
});

export const mapStoreItemFromApi = (apiItem: IApiStoreItem): IStoreItem => {
  // Для промокодов в заказах может не быть изображений
  const defaultImage: IStoreImage = { id: 0, url: '' };
  
  const baseItem: IStoreItem = {
    id: apiItem.id,
    title: apiItem.title,
    description: apiItem.description,
    mainImage: apiItem.mainImage ? mapStoreImage(apiItem.mainImage) : defaultImage,
    additionalImages: (apiItem.additionalImages || []).map(mapStoreImage),
    status: apiItem.status || 'ACTIVE',
    type: apiItem.type,
    cost: apiItem.cost || apiItem.priceCustomer || 0,
    availableQuantity: apiItem.availableQuantity,
    onePerHand: apiItem.onePerHand ?? false,
    pickupLocation: apiItem.pickupLocation,
    contactUsername: apiItem.contactUsername,
    establishmentId: apiItem.establishmentId,
    establishmentTitle: apiItem.establishmentTitle,
    pickupHours: apiItem.saleTimeStart && apiItem.saleTimeEnd ? `${extractTime(apiItem.saleTimeStart)} - ${extractTime(
      apiItem.saleTimeEnd
    )}` : undefined,
    promoCodeType: apiItem.promoCodeType,
    objectId: apiItem.objectId,
    objectTitle: apiItem.objectTitle,
  };

  // Для наборов добавляем поля цены
  if (apiItem.type === 'URBAN_BOX') {
    baseItem.priceActual = apiItem.priceActual;
    baseItem.priceCustomer = apiItem.priceCustomer;
    baseItem.cost = apiItem.priceCustomer || 0;
  }

  return baseItem;
};


const extractTime = (dateTime: string): string => {
  const [, time] = dateTime.split('T');
  return time.slice(0, 5);
};
