export interface IApiUserTagResponse {
  id: number;
  username: string;
  imgUrl?: string;
}

export interface IApiUserTag {
  id: number;
  tag: string;
  username?: string;
}

export interface IUserTag {
  id: number;
  tag: string;
  username?: string;
}



export interface IApiTransferBonusesRequest {
  toUsername: string;
  amount: number;
  description: string;
}

export interface IApiTransferBonusesResponse {
  success: boolean;
  message?: string;
  newBalance?: number;
}

export interface ITransferBonusesRequest {
  recipientTag: string;
  amount: number;
  description: string;
}

export interface ITransferBonusesResponse {
  message?: string;
  platformCommission: number
  status: "SUCCESS" | "ERROR"
  transactionId: number
  transferredAmount: number
}


