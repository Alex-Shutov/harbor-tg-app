import { useEffect, useState } from 'react';
import { isTelegramWebAppAvailable } from '@/utils/telegramVersion';

export const useNativeTelegram = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isTelegramWebAppAvailable() && window.Telegram?.WebApp) {
      try {
        // Сообщаем Telegram, что приложение готово к отображению
        if (typeof window.Telegram.WebApp.ready === 'function') {
          window.Telegram.WebApp.ready();
        }
        setIsReady(true);
      } catch (error) {
        console.warn('Failed to call Telegram.WebApp.ready():', error);
        // Устанавливаем isReady даже при ошибке, чтобы приложение могло работать
        setIsReady(true);
      }
    } else {
      // Если Telegram WebApp недоступен, все равно помечаем как готово
      // для работы в других окружениях
      setIsReady(true);
    }
  }, []);

  return {
    isReady,
    webApp: window.Telegram?.WebApp || null
  };
};