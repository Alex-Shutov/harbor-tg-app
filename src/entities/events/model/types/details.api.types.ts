import { EAgeRating, EScheduleType } from '@shared/constants';
import {
  IApiCategory, IApiEmbeddedEstablishment, IApiEmbeddedLeisure,
  IApiImage,
  IApiMapLocation,
  IApiOpeningHour,
  IApiPeriodDayInfo,
  IApiPromoCode,
  IApiReview,
  IApiSectionWithImages,
} from '@shared/types';



export interface IApiEventDetails {
  id: number;
  title: string;
  description: string;
  rating: number;
  inFavorites: boolean;
  serialNumber: number;

  mainImg: IApiImage;
  sectionsWithImages: IApiSectionWithImages[];

  categories: IApiCategory[];

  type: EScheduleType;
  dateTime?: string;
  startDate?: string;
  endDate?: string;
  periodDaysInfo?: IApiPeriodDayInfo[];
  openingHours?: IApiOpeningHour[];

  promoCodes?: IApiPromoCode[];

  mapLocation: IApiMapLocation;
  mapPoint: {
    addressTitle:string,
    latitude:number,
    longitude:number,
  };

  review?: IApiReview;

  phoneNumbers: string[];
  webSiteLink: string;

  ageRating?: EAgeRating;
  establishments:IApiEmbeddedEstablishment[];
  leisure: IApiEmbeddedLeisure[];
}
