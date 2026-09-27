import { useCallback } from 'react';
import {openLink} from '@telegram-apps/sdk';

interface UseViewReviewProps {
  videoUrl: string;
}

export const useViewReview = ({ videoUrl }: UseViewReviewProps) => {
  const handleOpenReview = useCallback(() => {
    if (!videoUrl) return;

    try {
        openLink(videoUrl,{tryInstantView: true});
    } catch (error) {
      console.error('Ошибка при открытии обзора:', error);
    }
  }, [videoUrl]);

  return { handleOpenReview };
};
