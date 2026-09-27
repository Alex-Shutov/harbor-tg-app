// shared/lib/utils/share.utils.ts
import { EPageType } from '@shared/constants';

export interface IShareLinkConfig {
  type?: EPageType;
  id?: number;
  userHash?: string;
  botUsername?: string;
  miniAppUrl?:string
}

export const generateShareText = (
  type: EPageType,
  title?: string,
) => {
  const baseText = (() => {
    switch (type) {
      case EPageType.ESTABLISHMENT:
        return `Смотри, какое место в úrbanist я нашел!🤩`;
      case EPageType.LEISURE:
        return `Смотри, какое место в úrbanist я нашел!🤩`;
      case EPageType.EVENT:
        return `Смотри, какое событие в úrbanist я нашел!🤩`;
      case EPageType.TASK:
        return `Смотри, какое задание в úrbanist я нашел!🤩`;
      case EPageType.GIVEAWAY:
        return `Смотри, какой розыгрыш в úrbanist я нашел!🤩`;
      case EPageType.PROMOCODE:
        return `Смотри, какой промокод в úrbanist я нашел!🤩`;
    }
  })();

  if (!title) {
    return baseText;
  }

  // const objectTypeLabel = (() => {
  //   switch (type) {
  //     case EPageType.ESTABLISHMENT:
  //       return 'Заведение';
  //     case EPageType.LEISURE:
  //       return 'Место';
  //     case EPageType.EVENT:
  //       return 'Мероприятие';
  //     case EPageType.TASK:
  //       return 'Задание';
  //     case EPageType.GIVEAWAY:
  //       return 'Розыгрыш';
  //     case EPageType.PROMOCODE:
  //       return 'Промокод';
  //   }
  // })();

  return `${baseText}`;
}

/**
 * Генерирует ссылку на mini app для шеринга
 * Формат: https://t.me/bot_username?startapp=type_id или hash={userHash}
 */
export const generateMiniAppShareLink = ({
                                           type,
                                           id,
                                           userHash,
                                           botUsername = import.meta.env.VITE_APP_BOT_USERNAME || 'your_bot_username',
                                           miniAppUrl = import.meta.env.VITE_APP_MINIAPP_URL || 'app_url',
                                         }: IShareLinkConfig): string => {
  let startAppParam: string;
  
  if (userHash) {
    // Новый формат для реферальных ссылок
    startAppParam = `hash=${userHash}`;
  } else if (type && id !== undefined) {
    // Старый формат для обычных ссылок
    startAppParam = `${type}_${id}`;
  } else {
    startAppParam = ''
  }
  
  return `t.me/${botUsername}/${miniAppUrl}?startapp=${encodeURIComponent(startAppParam)}`;
};

/**
 * Парсит startapp параметры mini app
 * Формат входа: "type_id" (например: "establishment_123") или "hash={userHash}"
 */
export const parseDeepLinkParams = (
  startapp?: string
): { type: EPageType; id: number } | { hash: string } | null => {
  if (!startapp) return null;

  try {
    const decoded = decodeURIComponent(startapp);

    if (decoded.startsWith('hash=')) {
      const hash = decoded.substring(5);
      if (hash) {
        return { hash };
      }
      return null;
    }

    const [type, idStr] = decoded.split('_');
    const id = parseInt(idStr, 10);

    if (isNaN(id) || !type) return null;

    if (!Object.values(EPageType).includes(type as EPageType)) {
      return null;
    }

    return { type: type as EPageType, id };
  } catch (error) {
    console.error('Failed to parse deep link params:', error);
    return null;
  }
};
