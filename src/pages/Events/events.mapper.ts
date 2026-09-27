import { AgeRating } from './events.types.ts';
import { isSameDay, parseISO } from 'date-fns';
import { OpeningHours, PeriodOpeningHours, WeekDay } from '@pages/Establishment/components/details/details.types.ts';
import { IApiCategory } from '@shared/types';

export interface Hours {
  openingHours?: OpeningHours[] | OpeningHours;
  periodDaysInfo?:PeriodOpeningHours[];
  dateTime?: string;
  startDate?: string;
  endDate?: string;
}

export interface HoursComponentProps {
  type: 'WORKING_HOURS' | 'DATE_TIME' | 'PERIOD' | "PERIOD_WITH_WORKING_HOURS";
  openingHours?: Hours['openingHours']
  periodDaysInfo?:PeriodOpeningHours[];
  dateTime?: string;
  startDate?: string;
  endDate?: string;
}


export interface ApiEvent extends HoursComponentProps {
  id: number;
  title: string;
  imgUrl: string;
  image?: {
    id:number;
    url: string;
  };
  categories: IApiCategory[]
  serialNumber?: number;
  ageRating?:AgeRating
  promotionExist: boolean;
  inFavorites: boolean;
  periodDaysInfo?:PeriodOpeningHours[];
}


type EventMapResponse = {
  [key: number]: ApiEvent[];
};

type EventListResponse = ApiEvent[];

export type GroupedApiEventResponse = {
  [key: string]: ApiEvent[];
};




export const mapEventsList = (apiData: ApiEvent[]): EventListResponse => {
  return apiData.map(item => ({
    id: item.id,
    title: item.title,
    entityType:'EVENTS',
    imgUrl: item.imgUrl ?? item?.image?.url,
    type: item.type,
    serialNumber: item.serialNumber,
    ageRating:item?.ageRating,
    categories: item.categories.map(category => ({
      id: category.id,
      title: category.title,
      priority: category.priority,
      innerCategories: category.innerCategories
    })),
    promotionExist: item.promotionExist,
    inFavorites: item.inFavorites,
    ...(item.type === 'PERIOD' && {
      startDate: item.startDate,
      endDate: item.endDate,
    }),
    ...(item.type === 'DATE_TIME' && {
      dateTime: item.dateTime,
    }),
    ...(item.type === 'WORKING_HOURS' && {
      openingHours: item?.openingHours && Array.isArray(item.openingHours) ? item.openingHours.map((hour) => ({
        from: hour.from,
        till: hour.till,
        currentDay: hour.currentDay,
        weekDay: hour.weekDay as keyof typeof WeekDay,
      })) : [],
    }),
    ...(item.type === 'PERIOD_WITH_WORKING_HOURS' && {
      periodDaysInfo: item?.periodDaysInfo && Array.isArray(item.periodDaysInfo) ? item.periodDaysInfo.map((hour) => ({
        id: hour.id,
        day: hour.day,
        startTime:hour.startTime,
        endTime:hour.endTime,
        currentDay: isSameDay(new Date(), parseISO(hour.day)),
        isOpen:hour.isOpen
      })) : [],
    }),
  }));
};

export const mapEventsCategories = (apiData: GroupedApiEventResponse): EventMapResponse => {
  const result: EventMapResponse = {};

  Object.entries(apiData).forEach(([categoryId, establishments]) => {
    result[Number(categoryId)] = establishments.map(item => ({
      id: item.id,
      title: item.title,
      entityType:'EVENTS',
      imgUrl: item.imgUrl ?? item?.image?.url,
      type: item.type,
      ageRating:item?.ageRating,
      categories: item.categories.map(category => ({
        id: category.id,
        title: category.title,
        priority: category.priority,
        innerCategories: category.innerCategories
      })),
      promotionExist: item.promotionExist,
      inFavorites: item.inFavorites,
      ...(item.type === 'PERIOD' && {
        startDate: item.startDate,
        endDate: item.endDate,
      }),
      ...(item.type === 'DATE_TIME' && {
        dateTime: item.dateTime,
      }),
      ...(item.type === 'WORKING_HOURS' && {
        openingHours: item?.openingHours && Array.isArray (item.openingHours) ? item.openingHours.map ((hour) => ({
          from: hour.from,
          till: hour.till,
          currentDay: hour.currentDay,
          weekDay: hour.weekDay as keyof typeof WeekDay,
        })) : [],
      }),
      ...(item.type === 'PERIOD_WITH_WORKING_HOURS' && {
        startDate: item.startDate,
        endDate: item.endDate,
        periodDaysInfo: item?.periodDaysInfo && Array.isArray(item.periodDaysInfo) ? item.periodDaysInfo.map((hour) => ({
          id: hour.id,
          day: hour.day,
          startTime:hour.startTime,
          endTime:hour.endTime,
          currentDay: isSameDay(new Date(), parseISO(hour.day)),
          isOpen:hour.isOpen
        })) : [],
      }),
    }))
  });
  return result;
}