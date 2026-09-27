import React, { useState, useEffect, useCallback } from 'react';
import { CaptchaModal } from '@/shared/ui';
import { getCaptchaToken, saveCaptchaToken, hasValidCaptchaToken } from '@/utils/captchaCache';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

interface CaptchaProviderProps {
  children: React.ReactNode;
}

export const CaptchaProvider: React.FC<CaptchaProviderProps> = ({
  children,
}) => {
  const [isCaptchaRequired, setIsCaptchaRequired] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  
  // Получаем требования к captcha из Redux store
  const captchaRequirements = useSelector(
    (state: RootState) => state.captcha.requirements
  );
  const captchaRequiredForLogin = captchaRequirements?.captchaRequiredForLogin ?? false;

  useEffect(() => {
    // Если captcha не требуется для входа, пропускаем проверку
    if (!captchaRequiredForLogin) {
      setIsCaptchaVerified(true);
      setIsCaptchaRequired(false);
      return;
    }

    // Если captcha требуется, проверяем кэш
    const cachedToken = getCaptchaToken();
    if (cachedToken && hasValidCaptchaToken()) {
      // Токен есть и валиден, пропускаем captcha
      setIsCaptchaVerified(true);
      setIsCaptchaRequired(false);
    } else {
      // Токена нет или истек, показываем captcha
      setIsCaptchaVerified(false);
      setIsCaptchaRequired(true);
    }
  }, [captchaRequiredForLogin, captchaRequirements]);

  const handleCaptchaSuccess = useCallback((token: string) => {
    // Сохраняем токен в кэш
    saveCaptchaToken(token);
    setIsCaptchaVerified(true);
    setIsCaptchaRequired(false);
  }, []);

  const handleCaptchaClose = useCallback(() => {
    // Не позволяем закрыть модальное окно без прохождения captcha
    // Можно оставить пустым или показать предупреждение
  }, []);

  // Если captcha требуется и еще не пройдена, показываем модальное окно captcha
  // Но не блокируем рендеринг children - показываем их вместе с модальным окном
  // чтобы приложение могло загружаться параллельно
  if (isCaptchaRequired && !isCaptchaVerified) {
    return (
      <>
        {children}
        <CaptchaModal
          isOpen={isCaptchaRequired}
          onClose={handleCaptchaClose}
          onSuccess={handleCaptchaSuccess}
          title="Подтвердите, что вы не робот"
          description="Пожалуйста, пройдите проверку безопасности для входа в приложение"
        />
      </>
    );
  }

  // Если captcha не требуется или уже пройдена, показываем children
  return <>{children}</>;
};

