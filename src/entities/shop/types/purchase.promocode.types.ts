import { IApiPromoCode } from '@shared/types';
import { EPageType } from '@shared/constants';

export interface IPromoCodeListResponse {
  items: IApiPromoCode[];
}

export interface IPromoCodePurchaseRequest {
  promoCodeType: EPageType;
  id: number;
}

export interface IPromoCodePurchaseResponse {
  receivedPromoCodeId: number
}