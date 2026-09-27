/**
 * Утилиты для проверки версии Telegram WebApp SDK
 */

/**
 * Минимальная версия Telegram WebApp SDK, необходимая для работы приложения
 * Формат версии: "6.0" (major.minor)
 */
export const MIN_REQUIRED_VERSION = '8.0';

/**
 * Получает текущую версию Telegram WebApp SDK
 * @returns Версия в формате "X.Y" или null, если версия недоступна
 */
export const getTelegramWebAppVersion = (): string | null => {
  if (typeof window === 'undefined' || !window.Telegram?.WebApp) {
    return null;
  }

  // Версия доступна через window.Telegram.WebApp.version
  // Если версия не указана, считаем что это старая версия
  const version = (window.Telegram.WebApp as any).version;
  
  if (typeof version === 'string') {
    return version;
  }

  // Если версия не указана, но WebApp доступен, это может быть версия < 6.0
  // Проверяем наличие ключевых функций для определения минимальной версии
  if (window.Telegram.WebApp.ready) {
    // Если есть ready(), это минимум версия 6.0
    return '6.0';
  }

  return null;
};

/**
 * Сравнивает две версии в формате "X.Y"
 * @param version1 Первая версия
 * @param version2 Вторая версия
 * @returns -1 если version1 < version2, 0 если равны, 1 если version1 > version2
 */
export const compareVersions = (version1: string, version2: string): number => {
  const v1Parts = version1.split('.').map(Number);
  const v2Parts = version2.split('.').map(Number);

  const maxLength = Math.max(v1Parts.length, v2Parts.length);

  for (let i = 0; i < maxLength; i++) {
    const v1Part = v1Parts[i] || 0;
    const v2Part = v2Parts[i] || 0;

    if (v1Part < v2Part) return -1;
    if (v1Part > v2Part) return 1;
  }

  return 0;
};

/**
 * Проверяет, соответствует ли текущая версия Telegram WebApp минимальным требованиям
 * @param minVersion Минимальная требуемая версия (по умолчанию MIN_REQUIRED_VERSION)
 * @returns true если версия соответствует требованиям, false если нет или версия недоступна
 */
export const isVersionSupported = (minVersion: string = MIN_REQUIRED_VERSION): boolean => {
  const currentVersion = getTelegramWebAppVersion();
  
  if (!currentVersion) {
    // Если версия недоступна, но WebApp существует, проверяем наличие базовых функций
    if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
      // Проверяем наличие ключевых функций для версии 6.0+
      const hasReady = typeof window.Telegram.WebApp.ready === 'function';
      return hasReady;
    }
    return false;
  }

  return compareVersions(currentVersion, minVersion) >= 0;
};

/**
 * Проверяет, доступен ли Telegram WebApp
 */
export const isTelegramWebAppAvailable = (): boolean => {
  return typeof window !== 'undefined' && !!window.Telegram?.WebApp;
};

/**
 * Получает информацию о версии для отладки
 */
export const getVersionInfo = () => {
  const isAvailable = isTelegramWebAppAvailable();
  const version = getTelegramWebAppVersion();
  const isSupported = isVersionSupported();
  
  return {
    isAvailable,
    version,
    minRequired: MIN_REQUIRED_VERSION,
    isSupported,
  };
};

