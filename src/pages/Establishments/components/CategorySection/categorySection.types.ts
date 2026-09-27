import {WeekDay} from "../../../Events/events.types.ts";
import { IApiCategory } from '@shared/types';
import { TimeOfDay } from '@/shared/types/common.types';

export interface ReservationBid {
  id: number;
  date: string;
  startTime: TimeOfDay;
  endTime: TimeOfDay;
  tableTitles: string[];
  guestsCount: number;
  reservationStatus: ReservationStatus;
  bidRejectedComment?: string;
}

export interface CategoryInfo {
  id: number;
  title: string;
  serialNumber:number
}

export interface InnerCategoryInfo extends CategoryInfo {
  serialNumber: number;
}

export interface FoodEstablishmentInfoDto {
  type?: EventType;
  dateTime?: string;
  startDate?: string;
  endDate?: string;
  openingHours?: {
    till: string;
    currentDay: boolean;
    weekDay: keyof typeof WeekDay;
    from: string
  }[];
  id: number;
  title: string;
  imgUrl: string;
  serialNumber: number;
  categories:IApiCategory[];
  promotionExist?: boolean;
  inFavorites?: boolean;
  reservationBidInfoList?: ReservationBid[];
  isWaitingList?: boolean;
  entityType?: 'FOOD_ESTABLISHMENT' | 'EVENT' | "LEISURE" | "EVENTS";
}

export enum EventType {
  WORKING_HOURS = 'WORKING_HOURS',
  DATE_TIME = 'DATE_TIME',
  PERIOD = 'PERIOD',
  PERIOD_WITH_WORKING_HOURS = 'PERIOD_WITH_WORKING_HOURS'
}

export enum ReservationStatus {
  WAITING = 'WAITING',
  REJECTED = 'REJECTED',
  APPROVED = 'APPROVED',
  FINISHED = 'FINISHED'
}


export type EstablishmentMapResponse = Record<number, FoodEstablishmentInfoDto[]>;

export type EstablishmentListResponse = FoodEstablishmentInfoDto[];
