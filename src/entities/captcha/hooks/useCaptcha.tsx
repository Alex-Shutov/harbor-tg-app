import React, { useState, useCallback, useRef } from 'react';
import { getCaptchaToken, saveCaptchaToken, hasValidCaptchaToken } from '@/utils/captchaCache';
import { CaptchaModal } from '@/shared/ui/CaptchaModal/CaptchaModal';

interface UseCaptchaOptions {
  /**
   * Требуется ли captcha для данного действия
   */
  required: boolean;
  /**
   * Callback при успешной проверке captcha
   */
  onSuccess: (token: string) => void | Promise<void>;
  /**
   * Callback при закрытии модального окна без прохождения captcha
   */
  onCancel?: () => void;
}

interface UseCaptchaReturn {
  /**
   * Показывать ли модальное окно captcha
   */
  showCaptcha: () => void;
  /**
   * Компонент модального окна captcha
   */
  CaptchaModalComponent: React.ReactNode;
  /**
   * Выполнить действие с проверкой captcha
   */
  executeWithCaptcha: () => Promise<void>;
}

/**
 * Хук для работы с captcha
 * Проверяет кэш и показывает модальное окно при необходимости
 */
export const useCaptcha = ({
  required,
  onSuccess,
  onCancel,
}: UseCaptchaOptions): UseCaptchaReturn => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const pendingActionRef = useRef<((token: string) => void | Promise<void>) | null>(null);

  const showCaptcha = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const handleCaptchaSuccess = useCallback(
    async (token: string) => {
      // Сохраняем токен в кэш
      saveCaptchaToken(token);
      setIsModalOpen(false);

      if (pendingActionRef.current) {
        await pendingActionRef.current(token);
        pendingActionRef.current = null;
      } else {
        await onSuccess(token);
      }
    },
    [onSuccess]
  );

  const handleCaptchaClose = useCallback(() => {
    setIsModalOpen(false);
    pendingActionRef.current = null;
    onCancel?.();
  }, [onCancel]);

  const executeWithCaptcha = useCallback(async (): Promise<void> => {
    // Если captcha не требуется, сразу выполняем действие
    if (!required) {
      await onSuccess('');
      return;
    }

    // Проверяем кэш
    const cachedToken = getCaptchaToken();
    if (cachedToken && hasValidCaptchaToken()) {
      // Используем кэшированный токен
      await onSuccess(cachedToken);
      return;
    }

    // Показываем модальное окно captcha
    pendingActionRef.current = onSuccess;
    setIsModalOpen(true);
    return Promise.resolve();
  }, [required, onSuccess]);

  const CaptchaModalComponent = (
    <CaptchaModal
      isOpen={isModalOpen}
      onClose={handleCaptchaClose}
      onSuccess={handleCaptchaSuccess}
      title="Подтвердите, что вы не робот"
      description="Пожалуйста, пройдите проверку безопасности"
    />
  );

  return {
    showCaptcha,
    CaptchaModalComponent,
    executeWithCaptcha,
  };
};

