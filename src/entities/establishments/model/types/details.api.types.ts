import { ECostLevel, EReservationType } from '@shared/constants';
import {
  IApiCategory, IApiEmbeddedEvent,
  IApiImage,
  IApiMapLocation, IApiMenu,
  IApiOpeningHour,
  IApiPromoCode, IApiReview,
  IApiSectionWithImages,
} from '@shared/types';


export interface  IApiEstablishment {
  id: number;
  title: string;
  description: string;
  rating: number;
  costLevel: ECostLevel;
  inFavorites: boolean;

  mainImg: IApiImage;
  menu?: IApiMenu;
  sectionsWithImages: IApiSectionWithImages[];

  categories: IApiCategory[];

  openingHours: IApiOpeningHour[];

  promoCodes?: IApiPromoCode[];

  mapLocation: IApiMapLocation;

  review?: IApiReview;

  events: IApiEmbeddedEvent[];

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


