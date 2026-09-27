import { IApiBannersResponse, IBanner } from '../types';

export const mapBannersFromApi = (data: IApiBannersResponse): IBanner[] => {
  return data.sliders.map((item) => ({
    id: item.id,
    imgUrl: item.imgUrl,
    linkToFollow: item.linkToFollow,
    serialNumber: item.serialNumber,
  }));
};

