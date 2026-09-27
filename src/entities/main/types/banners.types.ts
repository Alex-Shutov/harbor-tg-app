export interface IApiBanner {
  id: number;
  imgUrl: string;
  linkToFollow: string;
  serialNumber: number;
}

export interface IApiBannersResponse {
  sliders: IApiBanner[];
}

export interface IBanner {
  id: number;
  imgUrl: string;
  linkToFollow: string;
  serialNumber: number;
}

