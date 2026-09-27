import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLaunchParams } from '@telegram-apps/sdk-react';
import { parseDeepLinkParams } from '@shared/lib/utils/share.utils';
import { EPageType } from '@shared/constants';

interface UseDeepLinkingProps {
  isAuthenticated: boolean;
  isSubscribed: boolean;
}

export const useDeepLinking = ({
                                 isAuthenticated,
                                 isSubscribed,
                               }: UseDeepLinkingProps) => {
  const navigate = useNavigate();
  const lp = useLaunchParams();

  const redirectToPage = useCallback((type: EPageType, id: number) => {
    if (type === EPageType.TASK) {
      navigate(`/profile/tasks?taskId=${id}`, { replace: true });
      return;
    }

    if (type === EPageType.GIVEAWAY) {
      navigate(`/profile/raffles?giveawayId=${id}`, { replace: true });
      return;
    }

    if (type === EPageType.PROMOCODE) {
      navigate(`/profile/promocodes?promocodeId=${id}`, { replace: true });
      return;
    }

    const routeMap: Record<EPageType, string> = {
      [EPageType.ESTABLISHMENT]: `/establishment/${id}`,
      [EPageType.EVENT]: `/event/${id}`,
      [EPageType.LEISURE]: `/leisure/${id}`,
      [EPageType.TASK]: '', // Не используется, обрабатывается выше
      [EPageType.GIVEAWAY]: '', // Не используется, обрабатывается выше
      [EPageType.PROMOCODE]: '', // Не используется, обрабатывается выше
    };

    const route = routeMap[type];
    if (route) {
      navigate(route, { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const startParam = lp?.tgWebAppData?.start_param;
    
    if (!startParam) return;

    // Проверяем, был ли уже обработан этот start_param
    const processedStartParam = sessionStorage.getItem('processed_start_param');
    if (processedStartParam === startParam) {
      // Уже обработали, пытаемся удалить startapp из URL если возможно
      try {
        const url = new URL(window.location.href);
        if (url.searchParams.has('startapp')) {
          url.searchParams.delete('startapp');
          window.history.replaceState({}, '', url.toString());
        }
      } catch (e) {

      }
      return;
    }

    const parsed = parseDeepLinkParams(startParam);
    if (!parsed) return;


    if ('hash' in parsed) {

      sessionStorage.setItem('processed_start_param', startParam);
      return;
    }


    const { type, id } = parsed;


    sessionStorage.setItem('processed_start_param', startParam);

    if (isAuthenticated && isSubscribed) {
      redirectToPage(type, id);

      setTimeout(() => {
        try {
          const url = new URL(window.location.href);
          if (url.searchParams.has('startapp')) {
            url.searchParams.delete('startapp');
            window.history.replaceState({}, '', url.toString());
          }
        } catch (e) {

        }
      }, 100);
      return;
    }

    if (!isAuthenticated || !isSubscribed) {
      sessionStorage.setItem('intendedDestination', JSON.stringify({ type, id }));
    }
  }, [lp?.tgWebAppData?.start_param, isAuthenticated, isSubscribed, redirectToPage]);

  const tryRedirectionToPage = () => {
    const intendedDestinationStr = sessionStorage.getItem('intendedDestination');

    if (intendedDestinationStr) {
      try {
        const { type, id } = JSON.parse(intendedDestinationStr);
        sessionStorage.removeItem('intendedDestination');

        redirectToPage(type, id);
      } catch (error) {
        console.error('Failed to parse intended destination:', error);
      }
    }
  };

  return { tryRedirectionToPage };
};
