export interface Banner {
  id: number;
  imgUrl: string;
  linkToFollow: string;
  serialNumber: number;
}

export interface CollectionItem {
  id: number;
  imageUrl: string;
  title: string;
}

export type AsyncState<T> =
  | { state: 'loading' }
  | { state: 'hasData'; data: T }
  | { state: 'hasError'; error?: unknown };

export type TimeOfDay = {
  hour: number;
  minute: number;
  second?: number;
  nano?: number;
};

export type SpotCategory = {
  id: number;
  title: string;
  serialNumber?: number;
  priority?: number;
  innerCategoriesTitle?: string;
  innerCategories?: Omit<SpotCategory, 'innerCategoriesTitle'>[];
  image?: {
    id: number;
    filename: string;
    url: string;
  } | null;
};
