import { ECaptchaErrorCode, CAPTCHA_ERROR_MESSAGES } from '@/entities/captcha/types/captcha.types';
import { clearCaptchaToken } from '@/utils/captchaCache';

/**
 * Обрабатывает ошибки связанные с captcha
 */
export const handleCaptchaError = (error: any): string | null => {
  const errorCode = error?.response?.data?.errorCode || error?.data?.errorCode;
  
  if (errorCode && Object.values(ECaptchaErrorCode).includes(errorCode as ECaptchaErrorCode)) {
    return CAPTCHA_ERROR_MESSAGES[errorCode as ECaptchaErrorCode];
  }
  
  return null;
};

/**
 * Проверяет, является ли ошибка ошибкой капчи
 */
export const isCaptchaError = (error: any): boolean => {
  const errorCode = error?.response?.data?.errorCode || error?.data?.errorCode;
  return errorCode && Object.values(ECaptchaErrorCode).includes(errorCode as ECaptchaErrorCode);
};

/**
 * Обрабатывает ошибку капчи: очищает токен и возвращает true, если это ошибка капчи
 */
export const handleCaptchaErrorAndClear = (error: any): boolean => {
  if (isCaptchaError(error)) {
    clearCaptchaToken();
    return true;
  }
  return false;
};
