// providers/SubscriptionProvider.tsx
import { createContext, useEffect, useState, ReactNode } from 'react';
import { initDataRaw, useLaunchParams } from '@telegram-apps/sdk-react';
import { http, retryPendingRequests } from '../shared/http';
import SubscriptionFlow from '../pages/SubscriptionFlow';
import ChatIdRequiredFlow from '../pages/ChatIdRequiredFlow';
import Loader from '../shared/Loader';
import { ChannelData } from './subscription.mock.ts';
import { useDispatch } from 'react-redux';
import { userBalanceApi } from '@/entities/user-balance/api/user-balance.api.ts';
import { useDeepLinking, parseDeepLinkParams } from '@shared/lib';
import { store } from '@/store/store.ts';
import { baseApi } from '@shared/api/redux.api.ts';
import { SessionResponse } from '@shared/types';

interface SubscriptionContextType {
  isAuthenticated: boolean;
  isSubscribed: boolean;
  isLoading: boolean;
  channels: ChannelData[];
  hasChatId: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | null>(null);

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider = ({ children }: SubscriptionProviderProps) => {


  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [subscriptionState, setSubscriptionState] = useState<'checking' | 'needSubscribe' | 'notSubscribed' | 'confirmed'>('checking');
  const [_, setForceShowFlow] = useState(false);
  const [channels, setChannels] = useState<ChannelData[]>([]);
  const [hasChatId, setHasChatId] = useState(true);
  const [chatIdState, setChatIdState] = useState<'checking' | 'required' | 'confirmed'>('checking');

  const { tryRedirectionToPage } = useDeepLinking({
    isAuthenticated,
    isSubscribed,
  });
  
  const lp = useLaunchParams();

  const dispatch = useDispatch();

  const loadUserBalance = () => {
    try {
      // @ts-ignore
      dispatch(
        // @ts-ignore
        userBalanceApi.endpoints.getUserBalance.initiate(undefined)
      );
    } catch (error) {
      console.error('Failed to load user balance:', error);
    }
  };


  const refetchAtoms = () => {
    store.dispatch(baseApi.util.invalidateTags(['Establishment', 'Event', 'Leisure']));
  };

  const forceShowSubscription = () => {
    setIsSubscribed(false);
    setForceShowFlow(true);
    setSubscriptionState('needSubscribe');
  };

  useEffect(() => {
    const handleForceSubscription = () => {
      forceShowSubscription();
    };

    const handleChatIdRequired = () => {
      setHasChatId(false);
      setChatIdState('required');
    };

    window.addEventListener('force-subscription-flow', handleForceSubscription);
    window.addEventListener('chat-id-required', handleChatIdRequired);

    return () => {
      window.removeEventListener('force-subscription-flow', handleForceSubscription);
      window.removeEventListener('chat-id-required', handleChatIdRequired);
    };
  }, []);

  const checkInitialAuth = async () => {
    try {
      const isTelegramEnv = typeof window !== 'undefined' && !!window.Telegram?.WebApp;
      const mocksEnabled = import.meta.env.VITE_USE_MOCKS === 'true';

      if (isTelegramEnv || mocksEnabled) {

        let hash: string | undefined;
        const startParam = lp?.tgWebAppData?.start_param;
        if (startParam) {
          const parsed = parseDeepLinkParams(startParam);
          if (parsed && 'hash' in parsed) {
            hash = parsed.hash;
          }
        }

        let initData: string | undefined;
        try {
          initData = initDataRaw();
        } catch {
          initData = undefined;
        }

        const authResponse = await http.post<SessionResponse>('/authentication', { initData, userHash: hash  });
        store.dispatch(baseApi.util.resetApiState());
        setIsAuthenticated(true);

        // Сохраняем требования к captcha из ответа аутентификации
        if (authResponse.data) {
          const { setCaptchaRequirements } = await import('@/entities/captcha');
          store.dispatch(setCaptchaRequirements({
            captchaRequiredForLogin: authResponse.data.captchaRequiredForLogin ?? false,
            captchaRequiredForTask: authResponse.data.captchaRequiredForTask ?? false,
            captchaRequiredForGiveaway: authResponse.data.captchaRequiredForGiveaway ?? false,
            captchaRequiredForBookingTelegram: authResponse.data.captchaRequiredForBookingTelegram ?? false,
            captchaRequiredForWaitingListTelegram: authResponse.data.captchaRequiredForWaitingListTelegram ?? false,
          }));
        }

        // Проверяем наличие chatId
        const userHasChatId = authResponse.data?.hasChatId ?? true;
        setHasChatId(userHasChatId);

        if (!userHasChatId) {
          setChatIdState('required');
          setIsLoading(false);
          return;
        }

        setChatIdState('confirmed');

        const subscriptionResult = await checkSubscription();
        setIsSubscribed(subscriptionResult.isSubscribed);
        setChannels(subscriptionResult.channels);

        if (subscriptionResult.isSubscribed) {
          await refetchAtoms();
          retryPendingRequests();
          setSubscriptionState('confirmed');
          loadUserBalance();
          tryRedirectionToPage()
        } else {
          setSubscriptionState('needSubscribe');
        }
      }
    } catch (error) {
      // При ошибке аутентификации проверяем подписку на каналы
      const subscriptionResult = await checkSubscription();
      setIsSubscribed(subscriptionResult.isSubscribed);
      setChannels(subscriptionResult.channels);

      if (subscriptionResult.isSubscribed) {
        setIsAuthenticated(true);
        await refetchAtoms();
        retryPendingRequests();
        setSubscriptionState('confirmed');
        setChatIdState('confirmed');
      } else {
        setSubscriptionState('needSubscribe');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const checkSubscription = async (): Promise<{ isSubscribed: boolean; channels: ChannelData[] }> => {
    try {
      setSubscriptionState('checking')

      const response = await http.get('/subscription/check');
      if (response.status === 200) {
        return {
          isSubscribed: true,
          channels: []
        };
      }
    } catch (error: any) {

      // Если получили 400/403 с данными о каналах
      if (error.response && (error.response.status === 400 || error.response.status === 403)) {
        const channelsData = Array.isArray(error.response.data.channelsSubscriptionInfoList) ? error.response.data.channelsSubscriptionInfoList : [];
        return {
          isSubscribed: false,
          channels: channelsData
        };
      }
    }
    return {
      isSubscribed: false,
      channels: []
    };
  };

  const handleNavigateToApp = () => {
    setForceShowFlow(false);
    setSubscriptionState('confirmed');
    loadUserBalance();
    tryRedirectionToPage()
  };


  const handleCheckSubscription = async () => {
    try {
      const subscriptionResult = await checkSubscription();
      setChannels(subscriptionResult.channels);

      if (subscriptionResult.isSubscribed) {
        setIsSubscribed(true);
        setForceShowFlow(true);
        setSubscriptionState('confirmed');
        await refetchAtoms();
        loadUserBalance();
        tryRedirectionToPage()
        retryPendingRequests();
      } else {
        setSubscriptionState('notSubscribed');
      }
    } catch (error) {
      setSubscriptionState('notSubscribed');
    }
  };

  const handleCheckChatId = async () => {
    try {
      // Не меняем состояние на 'checking', чтобы избежать мерцания
      // Просто проверяем без изменения UI состояния
      
      let hash: string | undefined;
      const startParam = lp?.tgWebAppData?.start_param;
      if (startParam) {
        const parsed = parseDeepLinkParams(startParam);
        if (parsed && 'hash' in parsed) {
          hash = parsed.hash;
        }
      }

      const authResponse = await http.post<SessionResponse>('/authentication', { 
        initData: initDataRaw(), 
        userHash: hash 
      });
      
      // Сохраняем требования к captcha из ответа аутентификации
      if (authResponse.data) {
        const { setCaptchaRequirements } = await import('@/entities/captcha');
        store.dispatch(setCaptchaRequirements({
          captchaRequiredForLogin: authResponse.data.captchaRequiredForLogin ?? false,
          captchaRequiredForTask: authResponse.data.captchaRequiredForTask ?? false,
          captchaRequiredForGiveaway: authResponse.data.captchaRequiredForGiveaway ?? false,
          captchaRequiredForBookingTelegram: authResponse.data.captchaRequiredForBookingTelegram ?? false,
          captchaRequiredForWaitingListTelegram: authResponse.data.captchaRequiredForWaitingListTelegram ?? false,
        }));
      }
      
      const userHasChatId = authResponse.data?.hasChatId ?? false;
      setHasChatId(userHasChatId);

      if (userHasChatId) {
        setChatIdState('confirmed');
        store.dispatch(baseApi.util.resetApiState());
        setIsAuthenticated(true);

        // После получения chatId проверяем подписку на каналы
        const subscriptionResult = await checkSubscription();
        setIsSubscribed(subscriptionResult.isSubscribed);
        setChannels(subscriptionResult.channels);

        if (subscriptionResult.isSubscribed) {
          await refetchAtoms();
          retryPendingRequests();
          setSubscriptionState('confirmed');
          loadUserBalance();
          tryRedirectionToPage();
        } else {
          setSubscriptionState('needSubscribe');
        }
      } else {
        // Оставляем состояние 'required', не меняем его, чтобы избежать мерцания
        setChatIdState('required');
      }
    } catch (error) {
      console.error('Error checking chatId:', error);
      // Не меняем состояние при ошибке, чтобы избежать мерцания
    }
  };

  const handleContinueAfterChatId = () => {
    // После того как пользователь подписался на бота, продолжаем проверку подписки на каналы
    if (hasChatId) {
      setChatIdState('confirmed');
    }
  };

  useEffect(() => {
    checkInitialAuth();
  }, []);


  if (isLoading) {
    return <Loader />;
  }

  // Если требуется chatId, показываем экран подписки на бота
  if (chatIdState === 'required') {
    return (
      <ChatIdRequiredFlow
        onCheckChatId={handleCheckChatId}
        onContinue={handleContinueAfterChatId}
      />
    );
  }

  // Если требуется подписка на каналы, показываем экран подписки
  if (subscriptionState === 'needSubscribe' || subscriptionState === 'notSubscribed') {
    return (
      <SubscriptionFlow
        subscriptionState={subscriptionState}
        onCheckSubscription={handleCheckSubscription}
        onNavigateToApp={handleNavigateToApp}
        channels={channels}
      />
    );
  }

  return (
    <SubscriptionContext.Provider value={{
      isAuthenticated,
      isSubscribed,
      isLoading,
      channels,
      hasChatId
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

