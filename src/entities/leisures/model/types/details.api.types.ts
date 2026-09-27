import { EReservationType, EScheduleType } from '@shared/constants';
import {
  IApiCategory, IApiEmbeddedEvent,
  IApiImage,
  IApiMapLocation,
  IApiOpeningHour,
  IApiPeriodDayInfo,
  IApiPromoCode,
  IApiReview,
  IApiSectionWithImages,
} from '@shared/types';

export interface IApiLeisureDetails {
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

  averageBill: number;
  hasBreakfasts: boolean;
  hasBusinessLunches: boolean;
  hasDelivery: boolean;
  hasParking: boolean;
  hasCatering: boolean;
  hasBanquets: boolean;


  review?: IApiReview;
  events:IApiEmbeddedEvent[]
  reservationTypeEnum:EReservationType
  phoneNumbers: string[];
  webSiteLink: string;

  externalBookUrl: string;

}
