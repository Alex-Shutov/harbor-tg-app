import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBackButtonStack } from './useBackButtonStack';
import useBackButton from '@hooks/useBackButton.ts';

/**
 * Хук для автоматической навигации назад на основе истории браузера
 * Используется на страницах, где не нужна кастомная логика
 * 
 * @example
 * // На странице просто используйте хук без параметров
 * useAutoBackNavigation();
 */
export const useAutoBackNavigation = (priority:number=0) => {
  const navigate = useNavigate();
  const location = useLocation();

  const {show,hide} = useBackButton()

  useEffect (() => {
      show()

    return () => {
      hide()
    }
  }, [show,location.key]);


  useBackButtonStack(() => {

    navigate(-1);
  }, priority); // Низкий приоритет, чтобы кастомные обработчики могли перехватить
};

