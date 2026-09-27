import { PromoCode } from '../../../Account/components/Promocodes/promocodes.types.ts';
import { IApiCategory } from '@shared/types';
import { AgeRating, EventType } from '@pages/Events/events.types.ts';

export interface Image {
  id: number;
  name: string;
  url: string;
}

export enum WeekDay {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY',
}

export interface OpeningHours {
  weekDay: WeekDay | string;
  from: string;
  till: string;
  currentDay: boolean;
  open?:boolean
}

export interface PeriodOpeningHours {
  id: number;
  day:string;
  isOpen: boolean;
  currentDay: boolean;
  startTime: string;
  endTime: string;
}

export interface MapLocation {
  latitude?: string;
  longitude?: string;
  mapLink?:string
  pointTitle?:string

}

export enum ReservationTypeEnum {
  BY_PHONE = 'BY_PHONE',
  WITH_TABLE_SELECTION = 'WITH_TABLE_SELECTION',
  WITHOUT_TABLE_SELECTION = 'WITHOUT_TABLE_SELECTION',
  NONE='NONE',
}

export enum CostLevelEnum {
  ONE = 'ONE',
  TWO = 'TWO',
  THREE = 'THREE',
  FOUR = 'FOUR',
  FIVE = 'FIVE',
}

export interface EstablishmentDetails {
  id: number;
  rating: number;
  imgs: Image[];
  inFavorites:boolean
  type?: EventType;
  ageRating?:AgeRating,
  startDate?:string,
  endDate?:string,
  dateTime?:string,
  categories?:IApiCategory[]
  title: string;
  openingHours: OpeningHours[];
  description: string;
  promoCode?: PromoCode|null
  costLevel: CostLevelEnum;
  needBidBeforeField:boolean;
  mapLocation?: MapLocation|null;
  averageBill: string;
  hasBreakfasts?: boolean;
  hasBusinessLunches?: boolean;
  hasDelivery: boolean;
  hasParking: boolean;
  hasCatering: boolean;
  hasBanquets: boolean;
  phoneNumbers: string[];
  webSiteLink: string;
  reservationTypeEnum: ReservationTypeEnum;
  needMessageAfterSuccessBid:boolean;
  messageAfterSuccessBid:string | null;
  canBookSomeTables:boolean;
  periodDaysInfo?:PeriodOpeningHours[];

}



export const  CostLevel = {
  'ONE':1,
  'TWO':2,
  "THREE":3,
  "FOUR":4,
  "FIVE":5
}