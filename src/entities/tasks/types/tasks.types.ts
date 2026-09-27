export type ITaskType =
  | 'TELEGRAM_CHANNEL_SUBSCRIPTION'
  | 'APP_ACTIVITY'
  | 'BOOK_AND_VISIT_ESTABLISHMENT'
  | 'OTHER';

export type ITaskStatus =
  | 'ACTIVE'
  | 'REVIEW'
  | 'COMPLETED'
  | 'COMPLETED_AS_FULFILLED'
  | 'REJECTED';

export interface IApiAttachmentInfo {
  id: number;
  url: string;
  fileName: string;
  size?: number;
}

export interface IAbstractTaskInfo {
  id: number;
  title: string;
  description: string;
  image?: IApiAttachmentInfo | null;
  startDate: string;
  endDate: string;
  rewardAmount: number;
  participantsLimit: number;
  participantsCount: number;
  canParticipate: boolean;
  status: ITaskStatus;
  rejectionReason?: string | null;
  type: ITaskType;
}

export interface IAppActivityTask extends IAbstractTaskInfo {
  type: 'APP_ACTIVITY';
  countOfDays: number;
  numberOfDaysOfActivity: number;
}

export interface IOtherTaskMessageFile extends IApiAttachmentInfo {}

export type IOtherTaskMessageType = 'TEXT' | 'FILE_LIST';

export interface IOtherTaskMessage {
  id: number;
  type: IOtherTaskMessageType;
  text?: string | null;
  files?: IOtherTaskMessageFile[];
  createdDate: string;
  isMine: boolean;
}

export interface IOtherTask extends IAbstractTaskInfo {
  type: 'OTHER';
  messages: IOtherTaskMessage[];
}

export interface IBookAndVisitTask extends IAbstractTaskInfo {
  type: 'BOOK_AND_VISIT_ESTABLISHMENT';
  establishmentId: number;
  establishmentName: string;
}



export interface ITelegramChannelSubscriptionChannel {
  title: string;
  url: string;
  code: string;
  imgUrl?: string;
  isSubscribed: boolean;
}

export interface ITelegramChannelSubscriptionTask extends IAbstractTaskInfo {
  type: 'TELEGRAM_CHANNEL_SUBSCRIPTION';
  channels: ITelegramChannelSubscriptionChannel[];
}

export type ITask =
  | IAppActivityTask
  | IOtherTask
  | IBookAndVisitTask
  | ITelegramChannelSubscriptionTask
  | IAbstractTaskInfo;

export interface ITaskListResponse {
  tasks: ITask[];
}

export interface IExecuteTaskRequest {
  taskId: number;
  captchaToken?: string;
}

export interface IExecuteOtherTaskRequest {
  taskId: number;
  text: string;
  fileIds?: number[];
  captchaToken?: string;
}

export interface ISendMessageForOtherTaskRequest {
  taskId: number;
  message: string;
  fileIds?: number[];
}

export interface IUploadTempFileResponse {
  fileId: number;
}
