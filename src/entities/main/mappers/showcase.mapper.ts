import { IApiShowcaseResponse, IShowcaseItem } from '../types';

export const mapShowcaseFromApi = (data: IApiShowcaseResponse): IShowcaseItem[] => {
  const items: IShowcaseItem[] = [];

  data.establishments.forEach((item) => {
    items.push({
      id: item.id,
      title: item.title,
      imgUrl: item.imgUrl,
      serialNumber: item.serialNumber,
      categories: item.categories,
      inFavorites: item.inFavorites,
      type: 'establishment',
      promotionExist: item.promotionExist,
      urbanboxExist: item.urbanboxExist,
    });
  });

  data.leisure.forEach((item) => {
    items.push({
      id: item.id,
      title: item.title,
      imgUrl: item.imgUrl,
      serialNumber: item.serialNumber,
      categories: item.categories,
      inFavorites: item.inFavorites,
      type: 'leisure',
      isPromotionExist: item.isPromotionExist,
    });
  });

  data.events.forEach((item) => {
    items.push({
      id: item.id,
      title: item.title,
      imgUrl: item.imgUrl,
      serialNumber: item.serialNumber,
      categories: item.categories,
      inFavorites: item.inFavorites,
      type: 'event',
      eventType: item.type,
      startDate: item.startDate,
      endDate: item.endDate,
      dateTime: item.dateTime,
      periodDaysInfo: item.periodDaysInfo,
      openingHours: item.openingHours,
    });
  });

  return items.sort((a, b) => a.serialNumber - b.serialNumber);
};

