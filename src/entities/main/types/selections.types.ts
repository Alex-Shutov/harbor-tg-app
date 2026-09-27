export interface IApiSelection {
  id: number;
  title: string;
  priority: number;
  imgUrl: string;
}

export interface IApiSelectionsResponse {
  selections: IApiSelection[];
}

export interface ISelection {
  id: number;
  title: string;
  priority: number;
  imgUrl: string;
}

