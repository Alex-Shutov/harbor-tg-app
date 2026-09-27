import { EReservationType, ECostLevel, EScheduleType } from '@/shared/constants/types.constants';
import {
  IEmbeddedEvent,
  IEstablishmentCategory,
  IEstablishmentImage, IMapLocation, IMenu,
  IOpeningHours,
  IReview,
  ISectionWithImages,
} from '@shared/types';
import { IBaseDetails } from '@/entities/lib';
import { IPromoCode } from '@/entities/promocode/types';

export interface IEstablishmentDetails extends IBaseDetails{
  id: number;
  title: string;
  description: string;
  rating: number;
  costLevel: ECostLevel;
  inFavorites: boolean;
  type: EScheduleType;
  mainImg: IEstablishmentImage;
  menu?: IMenu;
  sectionsWithImages: ISectionWithImages[];

  categories: IEstablishmentCategory[];

  openingHours?: IOpeningHours[];

  promoCodes?: IPromoCode[];

  mapLocation: IMapLocation;

  review?: IReview;

  events: IEmbeddedEvent[];

  averageBill: number;
  hasBreakfasts: boolean;
  hasBusinessLunches: boolean;
  hasDelivery: boolean;
  hasParking: boolean;
  hasCatering: boolean;
  hasBanquets: boolean;

  phoneNumbers: string[];
  webSiteLink: string;

  reservationTypeEnum: EReservationType;
  needMessageAfterSuccessBid: boolean;
  needBidBeforeField: boolean;
  messageAfterSuccessBid: string;
  canBookSomeTables: boolean;
  partnersLinkForReserve?: string;
}
