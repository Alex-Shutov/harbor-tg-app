import { isSameDay, parseISO } from 'date-fns';
import {
  IApiEmbeddedEvent,
  IApiOpeningHour,
  IApiPeriodDayInfo,
  IApiTime, IEmbeddedEvent,
  IOpeningHours,
  IPeriodDaysInfo,
} from '@shared/types';
import { IApiBaseDetails, IBaseDetails } from '@/entities/lib/types/common.spot.types.ts';

export const mapOpeningHours = (hours?: IApiOpeningHour[]): IOpeningHours[] | undefined => {
  if (!hours || !Array.isArray(hours)) return undefined;

  return hours.map(hour => ({
    from: formatTimeToISO(hour.from),
    till: formatTimeToISO(hour.till),
    open:hour.open,
    currentDay: hour.currentDay,
    weekDay: hour.weekDay,
  }));
};

export const mapPeriodDaysInfo = (periodInfo?: IApiPeriodDayInfo[]): IPeriodDaysInfo[] | undefined => {
  if (!periodInfo || !Array.isArray(periodInfo)) return undefined;

  return periodInfo.map(info => ({
    id: info.id,
    day: info.day,
    startTime: info.startTime,
    endTime: info.endTime,
    currentDay: info.currentDay ?? isSameDay(new Date(), parseISO(info.day)),
    isOpen: info.isOpen,
  }));
};

const formatTimeToISO = (time: string | IApiTime): string => {
  if (typeof time === 'string') {
    return time;
  }

  if (time && typeof time === 'object') {
    const hour = String(time.hour).padStart(2, '0');
    const minute = String(time.minute).padStart(2, '0');
    const second = String(time.second || 0).padStart(2, '0');
    return `${hour}:${minute}:${second}`;
  }

  return '00:00:00';
};


export const mapBaseDetails = (data: IApiBaseDetails): IBaseDetails => {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    rating: data.rating,
    inFavorites: data.inFavorites,

    mainImg: data.mainImg,
    sectionsWithImages: data.sectionsWithImages,

    categories: data.categories,

    mapLocation: data.mapLocation,

    review: data.review,

    phoneNumbers: data.phoneNumbers || [],
    webSiteLink: data.webSiteLink || '',
    averageBill: data.averageBill,
    hasBreakfasts: data.hasBreakfasts,
    hasBusinessLunches: data.hasBusinessLunches,
    hasDelivery: data.hasDelivery,
    hasParking: data.hasParking,
    hasCatering: data.hasCatering,
    hasBanquets: data.hasBanquets
  };
};

export const mapEmbeddedEvent = (events:IApiEmbeddedEvent[]):IEmbeddedEvent[] =>
  events.map(el => ({
    ...el,
    openingHours: mapOpeningHours(el.openingHours),
    periodDaysInfo: mapPeriodDaysInfo(el.periodDaysInfo),
  }))