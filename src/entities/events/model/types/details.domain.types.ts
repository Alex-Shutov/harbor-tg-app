import { EAgeRating, EScheduleType } from '@shared/constants';
import {
  IEmbeddedEstablishment, IEmbeddedLeisure,
  IEstablishmentCategory,
  IEstablishmentImage,
  IOpeningHours, IPeriodDaysInfo,
  IReview,
  ISectionWithImages,
} from '@shared/types';
import { IBaseDetails } from '@/entities/lib';
import { IPromoCode } from '@/entities/promocode/types';


export interface IEventDetails extends IBaseDetails{
  id: number;
  title: string;
  description: string;
  rating: number;
  inFavorites: boolean;
  serialNumber: number;

  mainImg: IEstablishmentImage;
  sectionsWithImages: ISectionWithImages[];

  categories: IEstablishmentCategory[];

  type: EScheduleType;
  dateTime?: string;
  startDate?: string;
  endDate?: string;
  periodDaysInfo?: IPeriodDaysInfo[];
  openingHours?: IOpeningHours[];

  promoCodes?: IPromoCode[];

  mapPoint: {
    addressTitle:string,
    latitude:number,
    longitude:number,
  };

  review?: IReview;

  establishments:IEmbeddedEstablishment[];
  leisure: IEmbeddedLeisure[];
  ageRating?: EAgeRating;
  phoneNumbers: string[];
  webSiteLink: string;


}
