import {
  IApiCategory,
  IApiImage,
  IApiMapLocation,
  IApiReview,
  IApiSectionWithImages, IEstablishmentCategory, IEstablishmentImage, IMapLocation, IReview, ISectionWithImages,
} from '@shared/types';

export interface IApiBaseDetails {
  id: number;
  title: string;
  description: string;
  rating: number;
  inFavorites: boolean;

  mainImg: IApiImage;
  sectionsWithImages: IApiSectionWithImages[];

  categories: IApiCategory[];

  mapLocation: IApiMapLocation;

  review?: IApiReview;

  phoneNumbers: string[];
  webSiteLink: string;

  averageBill?: number;
  hasBreakfasts?: boolean;
  hasBusinessLunches?: boolean;
  hasDelivery?: boolean;
  hasParking?: boolean;
  hasCatering?: boolean;
  hasBanquets?: boolean;

}

export interface IBaseDetails {
  id: number;
  title: string;
  description: string;
  rating: number;
  inFavorites: boolean;

  mainImg: IEstablishmentImage;
  sectionsWithImages: ISectionWithImages[];

  categories: IEstablishmentCategory[];

  mapLocation: IMapLocation;

  review?: IReview;
  mapPoint?:{
    latitude: number;
    longitude: number;
    addressTitle:string;
  }

  phoneNumbers: string[];
  webSiteLink: string;

  averageBill?: number;
  hasBreakfasts?: boolean;
  hasBusinessLunches?: boolean;
  hasDelivery?: boolean;
  hasParking?: boolean;
  hasCatering?: boolean;
  hasBanquets?: boolean;
}
