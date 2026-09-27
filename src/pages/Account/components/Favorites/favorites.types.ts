import { Category } from '@pages/Establishments/components/CategoriesBar/categroies.atoms.ts';
import { FoodEstablishmentInfoDto } from '@pages/Establishments/components/CategorySection/categorySection.types.ts';

export interface FavoriteResponse {
  favoriteObjectsList: FoodEstablishmentInfoDto[];
}

export interface FavoriteCategoriesResponse {
  categories: Category[];
}

export interface FavoriteAllCategoriesResponse {
  [categoryId: string]: FoodEstablishmentInfoDto[];
}

export interface FavoritesCategory {
  id: number;
  title: string;
  type:"ESTABLISHMENT" | "EVENT" | "LEISURE" | ""
  entityType:"ESTABLISHMENT" | "EVENT" | "LEISURE" | ""
  innerCategories?:null
}