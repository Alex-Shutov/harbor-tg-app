/**
 * Утилиты для кэширования токена captcha в sessionStorage
 */

const CAPTCHA_TOKEN_KEY = 'captcha_token';
const CAPTCHA_TIMESTAMP_KEY = 'captcha_timestamp';
const CAPTCHA_TOKEN_TTL = 30 * 60 * 1000; // 30 минут в миллисекундах

/**
 * Сохраняет токен captcha в sessionStorage
 */
export const saveCaptchaToken = (token: string): void => {
  try {
    sessionStorage.setItem(CAPTCHA_TOKEN_KEY, token);
    sessionStorage.setItem(CAPTCHA_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.warn('Failed to save captcha token to sessionStorage:', error);
  }
};

/**
 * Получает токен captcha из sessionStorage, если он еще действителен
 */
export const getCaptchaToken = (): string | null => {
  try {
    const token = sessionStorage.getItem(CAPTCHA_TOKEN_KEY);
    const timestampStr = sessionStorage.getItem(CAPTCHA_TIMESTAMP_KEY);

    if (!token || !timestampStr) {
      return null;
    }

    const timestamp = parseInt(timestampStr, 10);
    const now = Date.now();

    // Проверяем, не истек ли токен
    if (now - timestamp > CAPTCHA_TOKEN_TTL) {
      clearCaptchaToken();
      return null;
    }

    return token;
  } catch (error) {
    console.warn('Failed to get captcha token from sessionStorage:', error);
    return null;
  }
};

/**
 * Очищает токен captcha из sessionStorage
 */
export const clearCaptchaToken = (): void => {
  try {
    sessionStorage.removeItem(CAPTCHA_TOKEN_KEY);
    sessionStorage.removeItem(CAPTCHA_TIMESTAMP_KEY);
  } catch (error) {
    console.warn('Failed to clear captcha token from sessionStorage:', error);
  }
};

/**
 * Проверяет, есть ли действительный токен captcha в кэше
 */
export const hasValidCaptchaToken = (): boolean => {
  return getCaptchaToken() !== null;
};

