import { EWeekDay, EScheduleType, EPageType } from '@/shared/constants/types.constants';
import { EPromoType, ERestrictionType, IPromoCodeImage } from '@/entities/promocode/types';

export interface IApiImage {
  id: number;
  url: string;
}

export interface IApiInnerCategory {
  id: number;
  title: string;
  priority: number;
}

export interface IApiCategory {
  id: number;
  title: string;
  serialNumber?: number;
  priority?: number;
  innerCategories?: IApiInnerCategory[];
  innerCategoryTitle?: string;
}

export interface IApiMenu{
  id: number;
  url: string;
}

export interface IApiTime {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}

export interface IApiOpeningHour {
  weekDay: EWeekDay;
  from: string;
  till:  string;
  open: boolean;
  currentDay: boolean;
}

export interface IApiPeriodDayInfo {
  currentDay: boolean;
  id: number;
  day: string;
  startTime: string;
  endTime: string;
  isOpen: boolean;
}

export interface IApiPromoCode {
  id: number;
  title: string;
  receivedPromoCodeId:number;
  description: string;
  code?: string;
  startDate: string;
  endDate: string;
  amount: number;
  appliedCount: number;
  receivedCount: number;
  img: IPromoCodeImage;
  cost: number;
  type: EPromoType;
  restrictionType: ERestrictionType;
  allowReuse: boolean;
  useOrGetType: "CAN_GET" | "CAN_USE"
  objectType: EPageType;
  objectId: number;
  objectTitle: string;
  isExpired?:boolean,
  isPurchasable?:boolean,
  receivedDateTime?: string | null; // Дата и время получения промокода с бекенда
  useDateTime?: string | null; // Дата и время применения промокода с бекенда
}

export interface IApiMapLocation {
  pointTitle: string;
  latitude: number;
  longitude: number;
  mapLink: string;
}

export interface IApiSectionWithImages {
  id: number;
  title: string;
  serialNumber: number;
  images: IApiImage[];
}

export interface IApiReview {
  id: number;
  title: string;
  content: string;
  videoUrl: string;
  img: IApiImage;
}

export interface IApiEmbeddedEvent {
  id: number;
  title: string;
  imgUrl: string;
  serialNumber: number;
  categories: IApiCategory[];
  inFavorites: boolean;
  type?: EScheduleType;

  dateTime?: string;
  startDate?: string;
  endDate?: string;
  periodDaysInfo?: IApiPeriodDayInfo[];
  openingHours?: IApiOpeningHour[];
}

export interface IApiEmbeddedEstablishment {
  id: number;
  title: string;
  imgUrl: string;
  serialNumber:number;
  categories: IApiCategory[];
  promotionExist:boolean;
  inFavorites:boolean;
}

export interface IApiEmbeddedLeisure extends Omit<IApiEmbeddedEstablishment,'promotionExist'>{
  isPromotionExist: boolean;
}