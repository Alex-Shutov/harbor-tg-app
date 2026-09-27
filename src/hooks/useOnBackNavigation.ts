import { useBackButtonStack } from './useBackButtonStack';

/**
 * Хук для обработки навигации назад
 * 
 * @deprecated Используйте useBackButtonStack напрямую
 * Этот хук оставлен для обратной совместимости
 * 
 * @param onBack - функция, которая будет вызвана при нажатии назад
 * @param isDisabled - отключен ли обработчик
 */
export const useOnBackNavigation = (onBack: () => void | Promise<void>, isDisabled: boolean = false) => {
  useBackButtonStack(onBack, 0, !isDisabled);
};
