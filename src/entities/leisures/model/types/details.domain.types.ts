import { EReservationType, EScheduleType } from '@shared/constants';
import {

  IEmbeddedEvent,
  IEstablishmentCategory, IEstablishmentImage,
  IMapLocation,
  IOpeningHours,
  IPeriodDaysInfo,

  IReview, ISectionWithImages,
} from '@shared/types';
import { IBaseDetails } from '@/entities/lib';
import { IPromoCode } from '@/entities/promocode/types';

export interface ILeisureDetails extends IBaseDetails{
  id: number;
  title: string;
  description: string;
  rating: number;
  inFavorites: boolean;
  serialNumber: number;

  mainImg: IEstablishmentImage;
  sectionsWithImages: ISectionWithImages[];

  categories: IEstablishmentCategory[];
  mapPoint:undefined
  promoCodes?: IPromoCode[];
  type: EScheduleType;
  dateTime?: string;
  startDate?: string;
  endDate?: string;
  periodDaysInfo?: IPeriodDaysInfo[];
  openingHours?: IOpeningHours[];

  promoCode?: IPromoCode;

  mapLocation: IMapLocation;

  review?: IReview;

  averageBill?: number;
  hasBreakfasts?: boolean;
  hasBusinessLunches?: boolean;
  hasDelivery?: boolean;
  hasParking?: boolean;
  hasCatering?: boolean;
  hasBanquets?: boolean;
  canBookSomeTables:undefined,

  phoneNumbers: string[];
  webSiteLink: string;
  events: IEmbeddedEvent[];
  reservationTypeEnum:EReservationType;
  externalBookUrl:string
}
