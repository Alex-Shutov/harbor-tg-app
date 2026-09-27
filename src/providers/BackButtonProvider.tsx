import React, { createContext, useContext, useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { backButton } from '@telegram-apps/sdk-react';

/**
 * Тип обработчика кнопки "назад"
 * Может быть синхронной или асинхронной функцией
 */
type BackHandler = () => void | Promise<void>;

/**
 * Контекст для управления кнопкой "назад"
 * 
 * @property pushHandler - функция для добавления обработчика в стек
 * @property isBackButtonVisible - видима ли кнопка сейчас
 * @property setBackButtonVisible - функция для управления видимостью кнопки
 */
interface BackButtonContextType {
  pushHandler: (handler: BackHandler, priority?: number) => () => void;
  isBackButtonVisible: boolean;
  setBackButtonVisible: (visible: boolean) => void;
}

const BackButtonContext = createContext<BackButtonContextType | null>(null);

export const useBackButtonContext = () => {
  const context = useContext(BackButtonContext);
  if (!context) {
    throw new Error('useBackButtonContext must be used within BackButtonProvider');
  }
  return context;
};

interface BackButtonProviderProps {
  children: React.ReactNode;
  /**
   * Пути, на которых кнопка назад должна быть скрыта
   * По умолчанию: ['/subscription']
   * 
   * @example
   * <BackButtonProvider hiddenPaths={['/subscription', '/login']}>
   *   {children}
   * </BackButtonProvider>
   */
  hiddenPaths?: string[];
}

export const BackButtonProvider: React.FC<BackButtonProviderProps> = ({
  children,
  hiddenPaths = ['/subscription'],
}) => {
  const location = useLocation();
  const handlersRef = useRef<Array<{ handler: BackHandler; priority: number }>>([]);
  const [isBackButtonVisible, setIsBackButtonVisible] = useState(true);
  const isProcessingRef = useRef(false);

  const shouldHide = hiddenPaths.some((path) => location.pathname.startsWith(path));

  useEffect(() => {
    try {
      if (!backButton.isSupported()) {
        return;
      }

      if (shouldHide) {
        if (backButton.hide.isAvailable()) {
          backButton.hide();
        }
        setIsBackButtonVisible(false);
      } else {
        if (backButton.show.isAvailable()) {
          backButton.show();
        }
        setIsBackButtonVisible(true);
      }
    } catch (error) {
      console.warn('Failed to toggle back button visibility:', error);
    }
  }, [shouldHide]);

  const handleBackClick = useCallback(async () => {
    if (isProcessingRef.current) {
      return;
    }

    isProcessingRef.current = true;

    try {
      const handlers = handlersRef.current;
      if (handlers.length > 0) {
        // Берем первый элемент (с самым высоким приоритетом после сортировки)
        const { handler, priority } = handlers[0];
        console.log('[BackButton] Executing handler with priority:', priority, 'Total handlers:', handlers.length);
        await handler();
      } else {
        console.log('[BackButton] No handlers registered');
      }
    } finally {
      isProcessingRef.current = false;
    }
  }, []);

  useEffect(() => {
    try {
      if (!backButton.isSupported() || shouldHide || !backButton.onClick.isAvailable()) {
        return;
      }

      const unsubscribe = backButton.onClick(handleBackClick);

      return () => {
        try {
          //@ts-ignore
          if (unsubscribe && backButton.offClick.isAvailable()) {
            backButton.offClick(handleBackClick);
          }
        } catch (error) {
          console.warn('Failed to unsubscribe back button click:', error);
        }
      };
    } catch (error) {
      console.warn('Failed to subscribe back button click:', error);
    }
  }, [handleBackClick, shouldHide]);

  const pushHandler = useCallback((handler: BackHandler, priority: number = 0) => {
    const handlerEntry = { handler, priority };
    handlersRef.current.push(handlerEntry);
    
    handlersRef.current.sort((a, b) => b.priority - a.priority);

    console.log('[BackButton] Handler registered with priority:', priority, 'Total handlers:', handlersRef.current.length);

    return () => {
      handlersRef.current = handlersRef.current.filter((h) => h !== handlerEntry);
      console.log('[BackButton] Handler removed. Remaining handlers:', handlersRef.current.length);
    };
  }, []);

  const setBackButtonVisible = useCallback((visible: boolean) => {
    try {
      if (!backButton.isSupported()) {
        return;
      }

      if (visible) {
        if (backButton.show.isAvailable()) {
          backButton.show();
        }
        setIsBackButtonVisible(true);
      } else {
        if (backButton.hide.isAvailable()) {
          backButton.hide();
        }
        setIsBackButtonVisible(false);
      }
    } catch (error) {
      console.warn('Failed to toggle back button visibility:', error);
    }
  }, []);

  return (
    <BackButtonContext.Provider
      value={{
        pushHandler,
        isBackButtonVisible,
        setBackButtonVisible,
      }}
    >
      {children}
    </BackButtonContext.Provider>
  );
};

