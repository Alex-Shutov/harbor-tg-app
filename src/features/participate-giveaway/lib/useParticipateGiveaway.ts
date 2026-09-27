import { useState, useCallback } from 'react';
import { useParticipateInGiveawayMutation } from '@/entities/giveaway';
import { IGiveaway } from '@/entities/giveaway/types';
import { IToastState } from '@/entities/promocode/types';
import { getCaptchaToken, saveCaptchaToken, hasValidCaptchaToken } from '@/utils/captchaCache';
import { useCaptchaRequirement } from '@/entities/captcha/hooks';
import { handleCaptchaErrorAndClear } from '@/shared/utils/captchaErrorHandler';

export const useParticipateGiveaway = () => {
  const [participate, { isLoading }] = useParticipateInGiveawayMutation();
  const { captchaRequiredForGiveaway } = useCaptchaRequirement();
  const [error, setError] = useState<string | null>(null);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    selectedGiveaway: IGiveaway | null;
  }>({
    isOpen: false,
    selectedGiveaway: null,
  });

  const [captchaModalOpen, setCaptchaModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<((token: string) => Promise<void>) | null>(null);

  const [toastState, setToastState] = useState<IToastState>({
    isVisible: false,
    title: '',
    description: '',
  });

  const openModal = (giveaway: IGiveaway) => {
    setModalState({
      isOpen: true,
      selectedGiveaway: giveaway,
    });
    setError(null);
  };

  const closeModal = () => {
    setModalState({
      isOpen: false,
      selectedGiveaway: null,
    });
    setError(null);
  };

  const showSuccessToast = useCallback((message: string) => {
    setToastState({
      isVisible: true,
      type: 'success',
      title: 'Успешно!',
      description: message,
      icon: '/subscribe-confirmed.gif',
      showCloseButton: true,
    });
  }, []);

  const showErrorToast = useCallback((message: string) => {
    setToastState({
      isVisible: true,
      type: 'error',
      icon: '/empty.gif',
      title: 'Ошибка',
      description: message,
      showCloseButton: true,
      duration: 0,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToastState((prev) => ({ ...prev, isVisible: false }));
  }, []);

  const executeParticipate = useCallback(async (captchaToken?: string) => {
    if (!modalState.selectedGiveaway) return;

    try {
      const requestData: any = {
        giveawayId: modalState.selectedGiveaway.id,
      };

      // Добавляем captchaToken только если он передан
      if (captchaToken) {
        requestData.captchaToken = captchaToken;
      }

      const updatedGiveaway = await participate(requestData).unwrap();
      setError(null);
      // Обновляем состояние модального окна с обновленным розыгрышем
      setModalState(prev => ({
        ...prev,
        selectedGiveaway: updatedGiveaway,
      }));
      showSuccessToast('Вы успешно участвуете в розыгрыше!');
      setCaptchaModalOpen(false);
      setPendingAction(null);
    } catch (err: any) {
      // Проверяем, является ли ошибка ошибкой капчи
      if (handleCaptchaErrorAndClear(err)) {
        // Очистили токен, показываем капчу снова
        setPendingAction(() => (token: string) => executeParticipate(token));
        setCaptchaModalOpen(true);
        return;
      }

      const errorMsg = err?.data?.message || 'Не удалось участвовать в розыгрыше';
      setError(errorMsg);
      showErrorToast(errorMsg);
      setCaptchaModalOpen(false);
      setPendingAction(null);
    }
  }, [modalState.selectedGiveaway, participate, showSuccessToast, showErrorToast]);

  const handleParticipate = useCallback(() => {
    if (!modalState.selectedGiveaway) return;

    if (!captchaRequiredForGiveaway) {
      executeParticipate();
      return;
    }

    // Проверяем, есть ли кэшированный токен
    const cachedToken = getCaptchaToken();
    if (cachedToken && hasValidCaptchaToken()) {
      // Используем кэшированный токен без показа модального окна
      executeParticipate(cachedToken);
      return;
    }

    // Если токена нет, показываем captcha
    setPendingAction(() => (token: string) => executeParticipate(token));
    setCaptchaModalOpen(true);
  }, [modalState.selectedGiveaway, captchaRequiredForGiveaway, executeParticipate]);

  const handleCaptchaSuccess = useCallback((token: string) => {
    // Сохраняем токен в кэш
    saveCaptchaToken(token);
    
    if (pendingAction) {
      // Передаем токен в функцию выполнения
      pendingAction(token);
    }
  }, [pendingAction]);

  const handleCaptchaClose = useCallback(() => {
    setCaptchaModalOpen(false);
    setPendingAction(null);
  }, []);

  const updateModalGiveaway = useCallback((giveaway: IGiveaway | null) => {
    if (modalState.isOpen && giveaway) {
      setModalState(prev => ({
        ...prev,
        selectedGiveaway: giveaway,
      }));
    }
  }, [modalState.isOpen]);

  return {
    modalState,
    openModal,
    closeModal,
    handleParticipate,
    isLoading,
    error,
    toastState,
    hideToast,
    updateModalGiveaway,
    captchaModalOpen,
    handleCaptchaSuccess,
    handleCaptchaClose,
  };
};


