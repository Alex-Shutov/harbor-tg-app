import { EPageType } from '@shared/constants';

export type EPromocodeStep = 'initial' | 'confirmation' | 'codeInput' | 'loading' | 'confirmed' | 'error';

export enum EPromoCodeStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  USED = 'used',
}

export enum ERestrictionType {
  UPON_RECEIPT = 'UPON_RECEIPT',
  BY_USE = 'BY_USE',
}

export enum EPromoType {
  FREE = 'FREE',
  PAID = 'PAID',
}



export interface IPromoCodeImage {
  id: number;
  url: string;
}

export interface IPromoCode {
  id: number;
  title: string;
  description: string;
  receivedPromoCodeId:number
  code?: string;
  startDate: string;
  endDate: string;
  amount: number;
  appliedCount: number;
  receivedCount: number;
  img: IPromoCodeImage;
  cost: number;
  type: EPromoType;
  restrictionType: ERestrictionType;
  useOrGetType: "CAN_GET" | "CAN_USE"
  allowReuse: boolean;
  objectType: EPageType;
  objectId: number;
  objectTitle: string;
  isExpired?: boolean
  isPurchasable?:boolean
  receivedDateTime?: string | null; // Дата и время получения промокода с бекенда
  useDateTime?: string | null; // Дата и время применения промокода с бекенда
}


export interface IPromocodeFlowState {
  step: EPromocodeStep;
  selectedPromoCode: IPromoCode | null;
  error: string | null;
  isLoading: boolean;
  pageId: number;
  context: 'profile' | 'object';
  objectName?: string;
  objectId?: number;
  issuedAt?: string;
}

export interface IToastState {
  isVisible: boolean;
  type?: 'success' | 'error';
  title: string;
  description: string;
  icon?: string;
  duration?: number;
  showCloseButton?: boolean;
}

export interface IPromoCodeResponse {
  active: IPromoCode[];
  completed: IPromoCode[];
  used: IPromoCode[];
}

