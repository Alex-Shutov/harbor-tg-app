export interface SessionResponse {
  sessionId: string;
  hasChatId: boolean; // true - если у пользователя есть chatId, false - если нет
  captchaRequiredForLogin?: boolean;
  captchaRequiredForTask?: boolean;
  captchaRequiredForGiveaway?: boolean;
  captchaRequiredForBookingTelegram?: boolean;
  captchaRequiredForWaitingListTelegram?: boolean;
}
