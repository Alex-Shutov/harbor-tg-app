import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export const useCustomNavigate = () => {
  const navigate = useNavigate();

  // Обычная навигация
  const navigateTo = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  // Навигация с заменой текущего пути
  const navigateReplace = useCallback((path: string) => {
    navigate(path, { replace: true });
  }, [navigate]);

  // Навигация без добавления в историю вообще (хак)
  const navigateWithoutHistory = useCallback((path: string) => {
    // Используем History API напрямую
    window.history.replaceState(null, '', path);

    // Программно генерируем события для обновления роутера
    const popStateEvent = new PopStateEvent('popstate', { state: null });
    window.dispatchEvent(popStateEvent);
  }, []);

  return { navigateTo, navigateReplace, navigateWithoutHistory };
};
