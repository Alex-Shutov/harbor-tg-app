// types/promoCode.types.ts
export interface PromoCode {
  id?: number;
  title: string;
  description: string;
  startDate:string;
  endDate:string;
  code: string;
  receivedByUser?: boolean;
  isReceivedByUser?:boolean
  discount?: number;
  imageUrl?: string;
}

export interface PromoCodeCategory {
  id: number;
  title: string;
  serialNumber: number;
}

export interface PromoCodesResponse {
  promoCodes: PromoCode[];
}

export interface PromoCodeCategoriesResponse {
  categories: PromoCodeCategory[];
}

// Параметры для поиска промокодов
export interface PromoCodeSearchParams {
  categoryId?: string;
  offset?: number;
  limit?: number;
}
