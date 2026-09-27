import { IApiUserTagResponse, IUserTag } from '../types/transfer.types';

export const mapUserTagFromApi = (apiTag: IApiUserTagResponse): IUserTag => {
  return {
    id: apiTag.id,
    tag: apiTag.username,
    username: apiTag.username,
  };
};


