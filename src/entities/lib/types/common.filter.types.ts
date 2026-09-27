export type IWorkTimeOption = 'Круглосуточно' | 'Открыто' | null;

export interface IBaseFilterState {
  selectedCategoryId: number | null;
  selectedSubcategoryIds: number[];
}