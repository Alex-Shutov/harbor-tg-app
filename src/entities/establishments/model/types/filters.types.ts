import { IWorkTimeOption } from '@/entities/lib';
import { ECostLevel } from '@shared/constants';

export interface IEstablishmentFiltersState {
  selectedCategoryId: number | null;
  selectedSubcategoryIds: number[];
  workTime: IWorkTimeOption;
  costLevel: ECostLevel | null;
  isPromotionExist: boolean | null;
  searchValue: string;
}
