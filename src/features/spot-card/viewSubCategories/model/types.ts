import { IEstablishmentCategory } from '@shared/types';

export interface IViewCategoriesProps {
  categories: IEstablishmentCategory[];
  selectedCategoryId?: number | null;
  canSelect?: boolean;
  onSelectCategory?: (categoryId: number) => void;
}

export type FlatCategory = IEstablishmentCategory;
