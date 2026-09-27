import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setCaptchaRequirements } from '../store/captcha.store';
import { useLazyGetCaptchaRequirementQuery } from '../api/captcha.api';
import { ICaptchaRequirements } from '../types/captcha.types';
import { useCallback } from 'react';

/**
 * Хук для работы с требованиями к captcha
 */
export const useCaptchaRequirement = () => {
  const dispatch = useAppDispatch();
  const requirements = useAppSelector((state) => state.captcha.requirements);
  const [fetchRequirements] = useLazyGetCaptchaRequirementQuery();

  /**
   * Загружает требования к captcha с сервера
   */
  const loadRequirements = useCallback(async () => {
    try {
      const result = await fetchRequirements().unwrap();
      dispatch(setCaptchaRequirements(result));
      return result;
    } catch (error) {
      console.error('Failed to load captcha requirements:', error);
      // В случае ошибки устанавливаем значения по умолчанию
      const defaultRequirements: ICaptchaRequirements = {
        captchaRequiredForLogin: false,
        captchaRequiredForTask: false,
        captchaRequiredForGiveaway: false,
        captchaRequiredForBookingTelegram: false,
        captchaRequiredForWaitingListTelegram: false,
      };
      dispatch(setCaptchaRequirements(defaultRequirements));
      return defaultRequirements;
    }
  }, [fetchRequirements, dispatch]);

  /**
   * Устанавливает требования к captcha (например, из ответа аутентификации)
   */
  const setRequirements = useCallback(
    (req: ICaptchaRequirements) => {
      dispatch(setCaptchaRequirements(req));
    },
    [dispatch]
  );

  return {
    requirements,
    loadRequirements,
    setRequirements,
    captchaRequiredForLogin: requirements?.captchaRequiredForLogin ?? false,
    captchaRequiredForTask: requirements?.captchaRequiredForTask ?? false,
    captchaRequiredForGiveaway: requirements?.captchaRequiredForGiveaway ?? false,
    captchaRequiredForBookingTelegram: requirements?.captchaRequiredForBookingTelegram ?? false,
    captchaRequiredForWaitingListTelegram: requirements?.captchaRequiredForWaitingListTelegram ?? false,
  };
};

