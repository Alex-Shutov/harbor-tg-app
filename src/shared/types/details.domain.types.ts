import { EScheduleType, EWeekDay } from '@shared/constants';
import { IApiCategory, IApiInnerCategory } from '@shared/types/details.api.types.ts';


export interface IEstablishmentImage {
  id: number;
  url: string;
}


export interface IEstablishmentInnerCategory {
  id: number;
  title: string;
  priority: number;
}

export interface IMenu {
  id: number;
  url: string;
}

export interface IEstablishmentCategory {
  id: number;
  title: string;
  serialNumber?: number;
  priority?: number;
  innerCategories?: IApiInnerCategory[];
  innerCategoryTitle?: string;
}

export interface IOpeningHours {
  weekDay: EWeekDay;
  from: string;
  till: string;
  open: boolean;
  currentDay: boolean;
}


export interface IPeriodDaysInfo {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
  isOpen: boolean;
  currentDay: boolean;
}



export interface IMapLocation {
  pointTitle: string;
  latitude: number;
  longitude: number;
  mapLink: string;
}


export interface ISectionWithImages {
  id: number;
  title: string;
  serialNumber: number;
  images: IEstablishmentImage[];
}

export interface IReview {
  id: number;
  title: string;
  content: string;
  videoUrl: string;
  img: IEstablishmentImage;
}

export interface IEmbeddedEvent {
  id: number;
  title: string;
  imgUrl: string;
  serialNumber: number;
  categories: IEstablishmentCategory[];
  inFavorites: boolean;
  type?: EScheduleType;

  dateTime?: string;
  startDate?: string;
  endDate?: string;
  periodDaysInfo?: IPeriodDaysInfo[];
  openingHours?: IOpeningHours[];
}




export interface IEmbeddedEstablishment {
  id: number;
  title: string;
  imgUrl: string;
  serialNumber:number;
  categories: IApiCategory[];
  promotionExist:boolean;
  inFavorites:boolean;
}

export interface IEmbeddedLeisure  extends IEmbeddedEstablishment{}