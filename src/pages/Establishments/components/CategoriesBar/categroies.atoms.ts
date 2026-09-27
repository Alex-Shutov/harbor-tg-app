import { IApiCategory } from '@shared/types';

export interface Category {
  id: number;
  title: string;
  serialNumber?: number;
  priority?: number;
  innerCategoriesTitle?:string;
  innerCategories?: Omit<Category,"innerCategoriesTitle">[];
}

export const allCategory: IApiCategory = {
  id: 0,
  title: 'Все',
  serialNumber: 0,
};
