import { useState, useCallback } from 'react';
import { usePurchasePromoCodeMutation } from '@/entities/shop/api/purchase.promocode.api';
import { useAppDispatch, useAppSelector } from '@/store/hooks.ts';
import { clearError, selectUserBalanceData, setError, setProcessing } from '@/entities/user-balance/model';
import { setPurchasedPromocode } from '@/entities/promocode/model/appliedPromocodes.slice';
import { hidePromoCode } from '@/entities/shop/model/shop.slice';
import { EPageType } from '@shared/constants';
import { IPromoCode, IToastState } from '@/entities/promocode/types';

export interface IPurchasePromocodeState {
  isProcessing: boolean;
  error: string | null;
  successMessage: string | null;
}

interface IModalState {
  isOpen: boolean;
  selectedPromoCode: IPromoCode | null;
  promoCodeId: number | null;
  promoCodeType: string | null;
  cost: number | null;
  isPurchased: boolean;
}

interface IUsePurchasePromocodeReturn {
  state: IPurchasePromocodeState;
  handlePurchase: (promoCodeId: number, promoCodeType: EPageType, cost: number,allowReuse:boolean) => Promise<IPromoCode>;
  canAfford: (cost: number) => boolean;
  userBalance: number;
  clearMessages: () => void;
  openModal: (promoCode:IPromoCode) => void;
  closeModal: () => void;
  handleModalPurchase: () => Promise<void>;
  toastState: IToastState;
  hideToast: () => void;
  modalState: IModalState
}

export const usePurchasePromocode = (): IUsePurchasePromocodeReturn => {
  const dispatch = useAppDispatch();
  const userBalance = useAppSelector(selectUserBalanceData);
  const [purchasePromoCodeMutation] = usePurchasePromoCodeMutation();

  const [modalState, setModalState] = useState<IModalState>({
    isOpen: false,
    selectedPromoCode: null,
    promoCodeId: null,
    promoCodeType: null,
    cost: null,
    isPurchased: false,
  });

  const [state, setState] = useState<IPurchasePromocodeState>({
    isProcessing: false,
    error: null,
    successMessage: null,
  });

  const [toastState, setToastState] = useState<IToastState>({
    isVisible: false,
    title: '',
    description: '',
  });

  const canAfford = useCallback(
    (cost: number): boolean => {
      return userBalance >= cost;
    },
    [userBalance]
  );

  const openModal = useCallback(
    (promoCode: IPromoCode) => {
      setModalState({
        isOpen: true,
        selectedPromoCode: promoCode,
        promoCodeId: promoCode.id,
        promoCodeType: promoCode.objectType,
        cost: promoCode.cost,
        isPurchased: false,
      });
      setToastState((prev) => ({ ...prev, isVisible: false }));
    },
    []
  );

  const closeModal = useCallback(() => {
    setModalState({
      isOpen: false,
      selectedPromoCode: null,
      promoCodeId: null,
      promoCodeType: null,
      cost: null,
      isPurchased: false,
    });
    setToastState((prev) => ({ ...prev, isVisible: false }));
  }, []);

  const clearMessages = useCallback(() => {
    setState((prev) => ({
      ...prev,
      error: null,
      successMessage: null,
    }));
    dispatch(clearError());
  }, [dispatch]);

  const handlePurchase = useCallback(
    async (promoCodeId: number, promoCodeType: EPageType, cost: number,allowReuse:boolean) => {
      try {
        setState((prev) => ({ ...prev, isProcessing: true, error: null }));
        dispatch(setProcessing(true));
        dispatch(clearError());

        if (!canAfford(cost)) {
          const errorMsg = 'Недостаточно бонусов для покупки';
          setState((prev) => ({
            ...prev,
            error: errorMsg,
            isProcessing: false,
          }));
          dispatch(setError(errorMsg));
          throw new Error(errorMsg);
        }

        const response = await purchasePromoCodeMutation({
          id: promoCodeId,
          promoCodeType,
        }).unwrap();

        if (response?.receivedPromoCodeId) {
          dispatch(setPurchasedPromocode({
            promoCodeId,
            receivedPromoCodeId: response.receivedPromoCodeId,
          }));
        }

        setState((prev) => ({
          ...prev,
          isProcessing: false,
          successMessage: 'Промокод успешно приобретен!',
        }));
        dispatch(setProcessing(false));
        if (allowReuse) {
          dispatch(hidePromoCode(promoCodeId));
        }
        
        return response;
      } catch (error: any) {
        const errorMessage =
          error?.data?.message ||
          (error instanceof Error ? error.message : 'Ошибка при покупке промокода');

        setState((prev) => ({
          ...prev,
          error: errorMessage,
          isProcessing: false,
        }));
        dispatch(setError(errorMessage));
        dispatch(setProcessing(false));

        throw error;
      }
    },
    [userBalance, canAfford, dispatch, purchasePromoCodeMutation]
  );

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

  const handleModalPurchase = useCallback(async () => {
    if (
      modalState.promoCodeId !== null &&
      modalState.promoCodeType !== null &&
      modalState.cost !== null &&
      modalState.selectedPromoCode
    ) {
      try {
        const response = await handlePurchase(
          modalState.promoCodeId,
          modalState.promoCodeType as any,
          modalState.cost,
          true
        );
        
        // Если у промокода нет возможности переиспользования, скрываем его из магазина
        if (!modalState.selectedPromoCode.allowReuse) {
          dispatch(hidePromoCode(modalState.promoCodeId));
        }
        
        // Обновляем промокод после покупки, устанавливая useOrGetType = 'CAN_USE' и receivedPromoCodeId из ответа
        // receivedPromoCodeId уже сохранен в Redux через handlePurchase
        setModalState((prev) => ({
          ...prev,
          isPurchased: true,
          selectedPromoCode: prev.selectedPromoCode && response?.receivedPromoCodeId
            ? {
                ...prev.selectedPromoCode,
                useOrGetType: 'CAN_USE' as const,
                receivedPromoCodeId: response.receivedPromoCodeId,
              }
            : prev.selectedPromoCode
              ? {
                  ...prev.selectedPromoCode,
                  useOrGetType: 'CAN_USE' as const,
                }
              : null,
        }));
      } catch (error: any) {
        const errorMsg = error?.data?.message || error?.message || 'Ошибка при покупке промокода';
        showErrorToast(errorMsg);
        throw error;
      }
    }
  }, [
    modalState.promoCodeId,
    modalState.promoCodeType,
    modalState.cost,
    modalState.selectedPromoCode,
    handlePurchase,
    showSuccessToast,
    showErrorToast,
    dispatch,
  ]);
  //@ts-ignore
  return {
    state,
    handlePurchase,
    canAfford,
    userBalance,
    clearMessages,
    openModal,
    closeModal,
    handleModalPurchase,
    modalState,
    toastState,
    hideToast,
  };
};
