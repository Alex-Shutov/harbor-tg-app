export enum EGiveawayStatus {
  ACTIVE = 'ACTIVE',
  PARTICIPATING = 'PARTICIPATING',
  COMPLETED = 'COMPLETED',
  PRIZE = 'PRIZE',
}

export enum EParticipationType {
  POINTS = 'POINTS',
  CHANNEL_SUBSCRIPTION = 'CHANNEL_SUBSCRIPTION',
}

export interface IChannel {
  title: string;
  url: string;
  code: string;
  imgUrl: string;
  isSubscribed: boolean;
}

export interface IImage {
  id: number;
  url: string;
}

export interface IGiveawayWinnerInfo {
  username: string;
  serialNumber: number;
}

export interface IApiGiveawayWinnerInfo {
  username: string;
  serialNumber: number;
}

export interface IGiveaway {
  id: number;
  status: EGiveawayStatus;
  title: string;
  description: string;
  participationType: EParticipationType;
  participationCost: number;
  channels: IChannel[];
  participantsLimit: number;
  participantsCount: number;
  winnersCount: number;
  image: IImage;
  startDateTime: string;
  endDateTime: string;
  isParticipant: boolean;
  isWinner: boolean;
  isExpired: boolean;
  winners?: IGiveawayWinnerInfo[];
}

export interface IApiGiveaway {
  id: number;
  status: EGiveawayStatus;
  title: string;
  description: string;
  participationType: EParticipationType;
  participationCost: number;
  channels: IChannel[];
  participantsLimit: number;
  participantsCount: number;
  winnersCount: number;
  image: IImage;
  startDateTime: string;
  endDateTime: string;
  isParticipant: boolean;
  isWinner: boolean;
  winners?: IApiGiveawayWinnerInfo[];
}

export interface IGiveawayListResponse {
  active: IGiveaway[];
  participating: IGiveaway[];
  completed: IGiveaway[];
  prizes: IGiveaway[];
}

export interface IApiGiveawayListResponse {
  active: IApiGiveaway[];
  participating: IApiGiveaway[];
  completed: IApiGiveaway[];
  prizes: IApiGiveaway[];
}

export interface IParticipateInGiveawayRequest {
  giveawayId: number;
  captchaToken?: string;
}

export interface IParticipateInGiveawayResponse {
  success: boolean;
  message: string;
  telegramGiveawayDetailedInfoDto: IApiGiveaway;
}
























