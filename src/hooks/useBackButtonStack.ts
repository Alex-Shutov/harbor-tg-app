import { useEffect } from 'react';
import { useBackButtonContext } from '@/providers/BackButtonProvider';

/**
 * Хук для управления кнопкой "назад" через стек обработчиков
 * 
 * @param onBack - функция, которая будет вызвана при нажатии назад
 * @param priority - приоритет обработчика (больше = выше в стеке, вызывается первым)
 * @param isEnabled - включен ли обработчик
 * 
 * @example
 * // Обычное использование
 * useBackButtonStack(() => {
 *   navigate('/previous-page');
 * });
 * 
 * @example
 * // С высоким приоритетом (перехватывает обработку)
 * useBackButtonStack(() => {
 *   closeModal();
 * }, 100);
 */
export const useBackButtonStack = (
  onBack: () => void | Promise<void>,
  priority: number = 0,
  isEnabled: boolean = true
) => {
  const { pushHandler } = useBackButtonContext();

  useEffect(() => {
    if (!isEnabled) {
      // Если обработчик отключен, не регистрируем его
      return;
    }

    // Регистрируем обработчик
    const removeHandler = pushHandler(onBack, priority);

    // Возвращаем функцию очистки для удаления обработчика при размонтировании или изменении isEnabled
    return removeHandler;
  }, [onBack, priority, isEnabled, pushHandler]);
};

