import { IApiCategory } from '@shared/types/details.api.types';
import { EScheduleType } from '@shared/constants';

export interface IApiShowcaseEstablishment {
  id: number;
  title: string;
  imgUrl: string;
  serialNumber: number;
  categories: IApiCategory[];
  promotionExist: boolean;
  inFavorites: boolean;
  urbanboxExist: boolean;
}

export interface IApiShowcaseLeisure {
  id: number;
  title: string;
  imgUrl: string;
  serialNumber: number;
  isPromotionExist: boolean;
  categories: IApiCategory[];
  inFavorites: boolean;
}

export interface IApiShowcaseEvent {
  id: number;
  title: string;
  imgUrl: string;
  serialNumber: number;
  categories: IApiCategory[];
  inFavorites: boolean;
  type?: EScheduleType;
  startDate?: string;
  endDate?: string;
  periodDaysInfo?: Array<{
    id: number;
    day: string;
    startTime: string;
    endTime: string;
    isOpen: boolean;
  }>;
  dateTime?: string;
  openingHours?: Array<{
    weekDay: string;
    from: {
      hour: number;
      minute: number;
      second: number;
      nano: number;
    };
    till: {
      hour: number;
      minute: number;
      second: number;
      nano: number;
    };
    currentDay: boolean;
    open: boolean;
  }>;
}

export interface IApiShowcaseResponse {
  establishments: IApiShowcaseEstablishment[];
  leisure: IApiShowcaseLeisure[];
  events: IApiShowcaseEvent[];
  generatedAt: string;
}

export interface IShowcaseItem {
  id: number;
  title: string;
  imgUrl: string;
  serialNumber: number;
  categories: IApiCategory[];
  inFavorites: boolean;
  type: 'establishment' | 'leisure' | 'event';
  promotionExist?: boolean;
  urbanboxExist?: boolean;
  isPromotionExist?: boolean;
  // Event specific fields
  eventType?: EScheduleType;
  startDate?: string;
  endDate?: string;
  dateTime?: string;
  periodDaysInfo?: Array<{
    id: number;
    day: string;
    startTime: string;
    endTime: string;
    isOpen: boolean;
  }>;
  openingHours?: Array<{
    weekDay: string;
    from: {
      hour: number;
      minute: number;
      second: number;
      nano: number;
    };
    till: {
      hour: number;
      minute: number;
      second: number;
      nano: number;
    };
    currentDay: boolean;
    open: boolean;
  }>;
}

