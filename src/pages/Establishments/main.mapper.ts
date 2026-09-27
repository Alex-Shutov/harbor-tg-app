import { IApiCategory } from '@shared/types';

export interface CategoryInfo {
  id: number;
  title: string;
  priority?: number;
  serialNumber?: number;
}

interface InnerCategory {
  id: number;
  title: string;
  priority?: number;
  serialNumber?: number;
}

interface EstablishmentBase {
  id: number;
  title: string;
  imgUrl: string;
  categories: CategoryInfo[];
  promotionExist: boolean;
  inFavorites: boolean;
}

export interface ApiEstablishment {
  id: number;
  title: string;
  type?: 'FOOD_ESTABLISHMENT' | "EVENT" | string;
  imgUrl: string;
  imageUrl?: string;
  image?: {
    id:number;
    url: string;
  };
  serialNumber?: number;
  categories: IApiCategory[]
  promotionExist: boolean;
  isPromotionExist?: boolean;
  isInFavorites?: boolean;
  inFavorites: boolean;
}

type EstablishmentMapResponse = {
  [key: number]: EstablishmentBase[];
};

type EstablishmentListResponse = EstablishmentBase[];

export type GroupedApiResponse = {
  [key: string]: ApiEstablishment[];
};


export type CategoriesWithInnerCategories =  {
  id: number;
  title: string;
  priority: number;
  innerCategories: InnerCategory[];
}[];


export const mapEstablishmentList = (apiData: ApiEstablishment[],entityType:'FOOD_ESTABLISHMENT' | 'LEISURE'='FOOD_ESTABLISHMENT'): EstablishmentListResponse => {
  return apiData.map(item => ({
    id: item.id,
    title: item.title,
    entityType:entityType,
    imgUrl: item.imgUrl ?? item?.image?.url,
    type:item.type,
    categories: item.categories.map(category => ({
      id: category.id,
      title: category.title,
      priority: category.priority,
      innerCategories: category.innerCategories
    })),
    promotionExist: item.promotionExist ?? item.isPromotionExist,
    inFavorites: item.inFavorites ?? item?.isInFavorites
  }));
};

export const mapEstablishmentCategories = (apiData: GroupedApiResponse,entityType:'FOOD_ESTABLISHMENT' | 'LEISURE'='FOOD_ESTABLISHMENT'): EstablishmentMapResponse => {
  const result: EstablishmentMapResponse = {};

  Object.entries(apiData).forEach(([categoryId, establishments]) => {
    result[Number(categoryId)] = establishments.map(item => ({
      id: item.id,
      title: item.title,
      entityType:entityType,
      imgUrl: item.imgUrl ?? item?.imageUrl ?? item?.image?.url,
      type:item.type,
      categories: item.categories.map(category => ({
        id: category.id,
        title: category.title,
        priority: category.priority,
        innerCategories: category.innerCategories
      })),
      promotionExist:  item.promotionExist ?? item.isPromotionExist,
      inFavorites: item.inFavorites ?? item?.isInFavorites
    }));
  });
  return result;
}


