/**
 * Типы для работы с captcha requirements
 */

export interface ICaptchaRequirements {
  captchaRequiredForLogin: boolean;
  captchaRequiredForTask: boolean;
  captchaRequiredForGiveaway: boolean;
  captchaRequiredForBookingTelegram: boolean;
  captchaRequiredForWaitingListTelegram: boolean;
}

export interface IApiCaptchaRequirements {
  captchaRequiredForLogin: boolean;
  captchaRequiredForTask: boolean;
  captchaRequiredForGiveaway: boolean;
  captchaRequiredForBookingTelegram: boolean;
  captchaRequiredForWaitingListTelegram: boolean;
}

/**
 * Коды ошибок связанных с captcha
 */
export enum ECaptchaErrorCode {
  CAPTCHA_REQUIRED = 'CAPTCHA_REQUIRED',
  INVALID_CAPTCHA_TOKEN = 'INVALID_CAPTCHA_TOKEN',
  CAPTCHA_VALIDATION_ERROR = 'CAPTCHA_VALIDATION_ERROR',
}

/**
 * Сообщения об ошибках captcha
 */
export const CAPTCHA_ERROR_MESSAGES: Record<ECaptchaErrorCode, string> = {
  [ECaptchaErrorCode.CAPTCHA_REQUIRED]: 'Требуется подтверждение капчи',
  [ECaptchaErrorCode.INVALID_CAPTCHA_TOKEN]: 'Неверный токен капчи, попробуйте снова',
  [ECaptchaErrorCode.CAPTCHA_VALIDATION_ERROR]: 'Ошибка проверки капчи',
};

