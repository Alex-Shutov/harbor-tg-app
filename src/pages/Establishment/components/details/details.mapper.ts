import { isSameDay, parseISO } from 'date-fns';
import { MapLocation, WeekDay } from '@pages/Establishment/components/details/details.types.ts';
import { AgeRating, EventDetails, EventType, ImageInfo } from '@pages/Events/events.types.ts';
import { IApiEstablishment } from '@/entities/establishments/model/types/details.api.types.ts';
import { IEstablishmentDetails } from '@/entities/establishments/model/types/details.domain.types.ts';
import { mapOpeningHours } from '@/entities/lib/utils.mapper.ts';
import { mapPromoCodeFromApi } from '@/entities/promocode/mappers';
import { EScheduleType } from '@shared/constants';


export interface TimeFormat {
  hours: number;
  minutes: number;
  seconds: number;
  nanos: number;
}



export const mapEstablishmentDetails = (apiData: IApiEstablishment): IEstablishmentDetails => {
  return {
    id: apiData.id,
    title: apiData.title,
    description: apiData.description,
    rating: apiData.rating,
    costLevel: apiData.costLevel,
    inFavorites: apiData.inFavorites,
    mainImg: apiData.mainImg,
    menu: apiData.menu,
    type:EScheduleType.WORKING_HOURS,
    sectionsWithImages: apiData.sectionsWithImages,
    categories: apiData.categories,
    openingHours: mapOpeningHours(apiData.openingHours),
    promoCodes: apiData.promoCodes?.map(mapPromoCodeFromApi),
    mapLocation: apiData.mapLocation,
    review: apiData.review,
    events: apiData.events,
    averageBill: apiData.averageBill,
    hasBreakfasts: apiData.hasBreakfasts,
    hasBusinessLunches: apiData.hasBusinessLunches,
    hasDelivery: apiData.hasDelivery,
    hasParking: apiData.hasParking,
    hasCatering: apiData.hasCatering,
    hasBanquets: apiData.hasBanquets,
    phoneNumbers: apiData.phoneNumbers,
    webSiteLink: apiData.webSiteLink,
    reservationTypeEnum: apiData.reservationTypeEnum,
    needMessageAfterSuccessBid: apiData.needMessageAfterSuccessBid,
    needBidBeforeField: apiData.needBidBeforeField,
    messageAfterSuccessBid: apiData.messageAfterSuccessBid,
    canBookSomeTables: apiData.canBookSomeTables,
    partnersLinkForReserve: apiData.partnersLinkForReserve,
  };
};



export const mapToEventDetails = (apiData: any): EventDetails => {
  const safeOpeningHours = Array.isArray(apiData?.openingHours)
    ? apiData.openingHours
    : [];

  const mapLocation: MapLocation = {
    pointTitle: apiData?.mapPoint?.addressTitle || '',
    latitude: String(apiData?.mapPoint?.latitude ?? ''),
    longitude: String(apiData?.mapPoint?.longitude ?? ''),
    mapLink: '', // Заполни, если нужно
  };

  const imgs: ImageInfo[] = (apiData.imgs || []).map((img: any, index: number) => ({
    id: img.id,
    name: `image${index + 1}.jpg`,
    url: img.url,
  }));

  const baseDetails = {
    id: apiData.id,
    title: apiData.title,
    type: apiData.type as EventType,
    imgs,
    categories: apiData.categories,
    locationInfo: apiData.mapPoint?.addressTitle || '',
    description: apiData.description,
    mapLocation,
    phoneNumbers: apiData.phoneNumbers || [],
    webSiteLink: apiData.webSiteLink || '',
    ageRating: apiData.ageRating as AgeRating,
    inFavorites: apiData.inFavorites,
    needMessageAfterSuccessBid: apiData.needMessageAfterSuccessBid,
    messageAfterSuccessBid: apiData.needMessageAfterSuccessBid ? apiData.messageAfterSuccessBid : null,
    canBookSomeTables: apiData.canBookSomeTables
  };

  if (apiData.type === 'PERIOD') {
    return {
      ...baseDetails,
      startDate: apiData.startDate,
      endDate: apiData.endDate,
    } as EventDetails;
  }

  if (apiData.type === 'DATE_TIME') {
    return {
      ...baseDetails,
      dateTime: apiData.dateTime,
    } as EventDetails;
  }

  if (apiData.type === 'PERIOD_WITH_WORKING_HOURS') {
    const originalDays = apiData?.periodDaysInfo && Array.isArray(apiData.periodDaysInfo)
      ? apiData.periodDaysInfo
      : [];

    const duplicatedDays = [...originalDays, ];

    return {
      ...baseDetails,
      startDate: apiData.startDate,
      endDate: apiData.endDate,
      periodDaysInfo: duplicatedDays.map((hour: any) => ({
        id: hour.id,
        day: hour.day,
        startTime: hour.startTime,
        endTime: hour.endTime,
        currentDay: isSameDay(new Date(), parseISO(hour.day)),
        isOpen: hour.isOpen
      }))
    } as EventDetails;
  }
  if (apiData.type === 'WORKING_HOURS') {
    return {
      ...baseDetails,
      openingHours: safeOpeningHours.map((hour: any) => ({
        from: hour.from,
        till: hour.till,
        currentDay: hour.currentDay,
        open: hour?.open,
        weekDay: hour.weekDay as keyof typeof WeekDay,
      })),
    } as EventDetails;
  }

  return baseDetails as EventDetails;
};

