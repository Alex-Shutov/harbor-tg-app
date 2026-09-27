import { IApiSelectionsResponse, ISelection } from '../types';

export const mapSelectionsFromApi = (data: IApiSelectionsResponse): ISelection[] => {
  return data.selections.map((item) => ({
    id: item.id,
    title: item.title,
    priority: item.priority,
    imgUrl: item.imgUrl,
  }));
};

