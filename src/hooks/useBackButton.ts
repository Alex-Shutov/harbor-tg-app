import { useCallback } from 'react';
import { useBackButtonContext } from '@/providers/BackButtonProvider';

/**
 * Хук для управления видимостью кнопки "назад"
 * 
 * @deprecated Используйте useBackButtonStack для обработки кликов
 * Этот хук оставлен для обратной совместимости
 */
const useBackButton = () => {
  const { setBackButtonVisible } = useBackButtonContext();

  const show = useCallback(() => {
    setBackButtonVisible(true);
  }, [setBackButtonVisible]);

  const hide = useCallback(() => {
    setBackButtonVisible(false);
  }, [setBackButtonVisible]);

  return {
    show,
    hide,
  };
};

export default useBackButton;
