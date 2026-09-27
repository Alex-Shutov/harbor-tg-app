import { EObjectType } from '@shared/constants/types.constants.ts';

export interface IToggleFavoriteArg {
  id: number;
  object_type: EObjectType;
}

export interface IToggleFavoriteResponse {
  id: number;
  object_type: EObjectType;
  inFavorites: boolean;
}
