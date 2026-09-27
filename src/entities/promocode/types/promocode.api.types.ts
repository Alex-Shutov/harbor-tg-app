import { IApiCategory } from '@shared/types';

export interface ICheckPromoCodeRequest {
  promoCodeStr: string;
}

export interface ICheckPromoCodeResponse {
  success: boolean;
  message?: string;
}



export interface IPromoCodeCategoriesResponse{
  establishments:IApiCategory[]
  events:IApiCategory[]
  leisure:IApiCategory[]
}