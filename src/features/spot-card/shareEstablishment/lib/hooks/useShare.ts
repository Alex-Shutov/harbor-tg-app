// features/spot-card/shareEstablishment/useShare.ts
import { useCallback, useMemo } from 'react';
import { EPageType } from '@shared/constants';
import { generateMiniAppShareLink, generateShareText } from '@shared/lib';

interface UseShareProps {
  title?: string;
  text?: string;
  pageType?: EPageType;
  entityId?: number;
  userHash?: string;
}

interface UseShareReturn {
  handleShare: () => void;
  shareLink:string
}

export const useShare = ({
                           title,
                           text = 'Посмотри, что я нашел!',
                           pageType,
                           entityId,
                           userHash,
                         }: UseShareProps): UseShareReturn => {
  const linkToShare = useMemo(()=>{
   return generateMiniAppShareLink(
     userHash
       ? { userHash }
       : pageType && entityId !== undefined
         ? { type: pageType, id: entityId }
         : {}
   );
  },[userHash,pageType,entityId])

  const handleShare = useCallback(() => {
    try {
      const shareLink = generateMiniAppShareLink(
        userHash
          ? { userHash }
          : pageType && entityId !== undefined
            ? { type: pageType, id: entityId }
            : {}
      );

      // Для реферальных ссылок используем другой текст
      const shareText = userHash
        ? `Переходи по моей реферальной ссылке и ты и я заработаем urbancoin 🔥`
        : `\n${generateShareText(pageType!, title)}`;

      if (window.Telegram?.WebApp?.openTelegramLink) {
        try {
          const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(shareLink)}&text=${encodeURIComponent(shareText)}`;
          window.Telegram.WebApp.openTelegramLink(telegramShareUrl);
          return;
        } catch (error) {
          console.warn('Failed to open Telegram link, falling back to clipboard:', error);
          // Продолжаем выполнение для фолбека
        }
      }

      // Фолбек: копируем в буфер обмена
      try {
        navigator.clipboard.writeText(`${shareText}\n${shareLink}`).then(() => {
          console.log('Link copied to clipboard');
        });
      } catch (clipboardError) {
        console.error('Failed to copy to clipboard:', clipboardError);
        // Последний фолбек: открываем в новой вкладке
        window.open(shareLink, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Failed to share:', error);
    }
  }, [title, text, pageType, entityId, userHash]);

  return { handleShare, shareLink: linkToShare};
};
