/**
 * Получает значение переменной окружения из window.env
 */
export const getEnvVar = (key: keyof NonNullable<Window['env']>): string | undefined => {
  return window.env?.[key];
};

/**
 * Получает hCaptcha sitekey из переменных окружения
 */
export const getHCaptchaSiteKey = (): string => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const siteKey = getEnvVar('HCAPTCHA_SITEKEY');
  if (!siteKey) {
    console.warn('HCAPTCHA_SITEKEY is not defined in window.env');
    return '10000000-ffff-ffff-ffff-000000000001'; // тестовый ключ hCaptcha
  }
  return siteKey;
};

