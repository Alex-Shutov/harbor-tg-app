import { useState, useCallback, useEffect } from 'react';
import { IPromoCode, IPromocodeFlowState, IToastState } from '@/entities/promocode/types';
import {
  useReceivePromoCodeMutation,
  useUsePromoCodeMutation,
} from '@/entities/promocode/api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { store } from '@/store/store';
import {
  setAppliedPromocode,
  selectAppliedPromocode,
} from '@/entities/promocode/model/appliedPromocodes.slice';
import { hidePromoCode } from '@/entities/shop/model/shop.slice';
import { usePurchasePromocode } from '@/features/purchase-promocode/lib';
import { useSelector } from 'react-redux';
import { selectUserBalanceData } from '@/entities/user-balance/model';
import { EPageType } from '@shared/constants/types.constants';


interface UseReceivePromoCodeProps {
  pageId: number;
  context: 'profile' | 'object';
  pageType?: EPageType;
  onDataRefresh?: () => void;
}

export const useReceivePromoCode = ({
                                      pageId,
                                      context,
                                      onDataRefresh,
                                    }: UseReceivePromoCodeProps) => {
  const dispatch = useAppDispatch();
  const { handlePurchase } = usePurchasePromocode();
  const [flowState, setFlowState] = useState<IPromocodeFlowState>({
    step: 'initial',
    selectedPromoCode: null,
    error: null,
    isLoading: false,
    pageId,
    context,
  });

  const balance = useSelector(selectUserBalanceData);

  const [toastState, setToastState] = useState<IToastState>({
    isVisible: false,
    title: '',
    description: '',
  });

  const [receivePromoCodeMutation] = useReceivePromoCodeMutation();
  const [usePromoCodeMutation] = useUsePromoCodeMutation();

  const appliedPromocodeState = useAppSelector((state) =>
    flowState.selectedPromoCode
      ? selectAppliedPromocode(state, flowState.selectedPromoCode.id)
      : undefined
  );

  // Синхронизируем состояние из store при изменении appliedPromocodeState
  // Обновляем только если issuedAt изменился, appliedCount изменился или receivedPromoCodeId изменился
  useEffect(() => {
    if (flowState.selectedPromoCode && appliedPromocodeState) {
      const currentIssuedAt = flowState.issuedAt;
      const currentAppliedCount = flowState.selectedPromoCode.appliedCount;
      const currentReceivedPromoCodeId = flowState.selectedPromoCode.receivedPromoCodeId;
      
      // Обновляем только если данные действительно изменились
      if (
        currentIssuedAt !== appliedPromocodeState.issuedAt ||
        currentAppliedCount !== appliedPromocodeState.appliedCount ||
        currentReceivedPromoCodeId !== appliedPromocodeState.receivedPromoCodeId
      ) {
        setFlowState((prev) => ({
          ...prev,
          selectedPromoCode: prev.selectedPromoCode
            ? {
                ...prev.selectedPromoCode,
                appliedCount: appliedPromocodeState.appliedCount,
                ...(appliedPromocodeState.receivedPromoCodeId !== undefined && {
                  receivedPromoCodeId: appliedPromocodeState.receivedPromoCodeId,
                }),
              }
            : null,
          issuedAt: appliedPromocodeState.issuedAt,
          step: 'confirmed',
        }));
      }
    }
  }, [appliedPromocodeState, flowState.selectedPromoCode?.id, flowState.issuedAt]);

  const openPromoCodeModal = useCallback(
    (promoCode: IPromoCode, objectName?: string, objectId?: number) => {
      // Проверяем, есть ли уже примененный промокод в store
      const state = store.getState();
      const appliedState = selectAppliedPromocode(state, promoCode.id);

      // Если промокод уже применен, используем данные из store
      const updatedPromoCode = appliedState
        ? {
            ...promoCode,
            appliedCount: appliedState.appliedCount,
            ...(appliedState.receivedPromoCodeId !== undefined && {
              receivedPromoCodeId: appliedState.receivedPromoCodeId,
            }),
          }
        : promoCode;

      setFlowState((prev) => ({
        ...prev,
        selectedPromoCode: updatedPromoCode,
        step: appliedState ? 'confirmed' : 'initial',
        error: null,
        objectName,
        objectId,
        issuedAt: appliedState?.issuedAt,
      }));
    },
    []
  );

  const closePromoCodeModal = useCallback(() => {
    setFlowState((prev) => ({
      ...prev,
      selectedPromoCode: null,
      step: 'initial',
      error: null,
    }));
  }, []);

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
      icon:'/empty.gif',
      title: 'Ошибка',
      description: message,
      showCloseButton: true,
      duration: 0,
    });
  }, []);

  const handleReceivePromoCode = useCallback(async () => {
    const promoCode = flowState.selectedPromoCode;
    if (!promoCode) return;

    setFlowState((prev) => ({ ...prev, isLoading: true }));

    try {
      const targetId = flowState.objectId || flowState.pageId ||promoCode.objectId;
      let  updatedPromoCode;
      if (context==='profile'){
        updatedPromoCode = await handlePurchase(promoCode.id,promoCode.objectType,promoCode.cost,promoCode.allowReuse)
      } else {

        const receiveSpotInfo = await receivePromoCodeMutation({
          targetId,
          promoCodeId: promoCode.id,
          type: promoCode.objectType,
        }).unwrap();
        updatedPromoCode = receiveSpotInfo.promoCodes.find((el:IPromoCode) => el.id === promoCode.id);
      }
      debugger
      if (updatedPromoCode) {

        const issuedAt = new Date().toISOString();

        dispatch(
          setAppliedPromocode({
            promoCodeId: updatedPromoCode.id,
            issuedAt,
            appliedCount: updatedPromoCode.appliedCount || 0,
          })
        );

        if (promoCode.type === 'PAID' && !promoCode.allowReuse && flowState.context === 'profile') {
          dispatch(hidePromoCode(promoCode.id));
        }

        setFlowState((prev) => ({
          ...prev,
          selectedPromoCode: updatedPromoCode,
          step: 'confirmed',
          isLoading: false,
          error: null,
          issuedAt,
        }));
        showSuccessToast('Промокод успешно получен');
        
        // Обновляем данные объекта после успешного получения промокода
        if (context === 'object' && onDataRefresh) {
          onDataRefresh();
        }
      }
    } catch (error: any) {
      const errorMsg = error?.data?.message || ( promoCode.cost > balance) ? 'Недостаточно средств' : 'Ошибка при получении промокода';
      setFlowState((prev) => ({
        ...prev,
        error: errorMsg,
        isLoading: false,
      }));
      showErrorToast(errorMsg);
    }
  }, [flowState.selectedPromoCode, flowState.objectId, flowState.pageId, flowState.context, receivePromoCodeMutation, showSuccessToast, showErrorToast, dispatch, context, onDataRefresh]);

  const handleApply = useCallback(() => {
    debugger
    const promoCode = flowState.selectedPromoCode;
    if (!promoCode) return;

    if (promoCode.useOrGetType === 'CAN_GET') {
      handleReceivePromoCode();
    } else {
      setFlowState((prev) => ({ ...prev, step: 'confirmation' }));
    }
  }, [flowState.selectedPromoCode, handleReceivePromoCode]);

  const handleConfirmApply = useCallback(() => {
    setFlowState((prev) => ({ ...prev, step: 'codeInput' }));
  }, []);

  const handleVerifyAndUse = useCallback(
    async (verificationCode: string) => {
      debugger
      if (!flowState.selectedPromoCode) return;

      setFlowState((prev) => ({ ...prev, isLoading: true }));

      try {
        const objectId = flowState.objectId || flowState.pageId || flowState.selectedPromoCode.objectId;
        await usePromoCodeMutation({
          receivedPromoCodeId: flowState.selectedPromoCode.receivedPromoCodeId,
          promoCodeType: flowState.selectedPromoCode.objectType,
          verificationCode,
          objectId,
        }).unwrap();
        debugger

        const issuedAt = new Date().toISOString();
        const newAppliedCount = flowState.selectedPromoCode.appliedCount + 1;
        
        dispatch(
          setAppliedPromocode({
            promoCodeId: flowState.selectedPromoCode.id,
            issuedAt,

            appliedCount: newAppliedCount,
          })
        );

        setFlowState((prev) => ({
          ...prev,
          selectedPromoCode: prev.selectedPromoCode
            ? {
                ...prev.selectedPromoCode,
                useDateTime:issuedAt,
                appliedCount: newAppliedCount,
              }
            : null,
          step: 'confirmed',
          isLoading: false,
          error: null,
          issuedAt,
        }));
        showSuccessToast('Промокод успешно применен');
        
        // Обновляем данные объекта после успешного применения промокода
        if (context === 'object' && onDataRefresh) {
          onDataRefresh();
        }

      } catch (error: any) {
        const errorMsg = error?.data?.message || 'Ошибка при применении промокода';
        setFlowState((prev) => ({
          ...prev,
          error: errorMsg,
          isLoading: false,
        }));
        showErrorToast(errorMsg);
      }
    },
    [flowState.selectedPromoCode, usePromoCodeMutation, showSuccessToast, showErrorToast, dispatch, context, onDataRefresh]
  );

  const handleCancel = useCallback(() => {
    setFlowState((prev) => ({ ...prev, step: 'initial' }));
  }, []);

  const hideToast = useCallback(() => {
    setToastState((prev) => ({ ...prev, isVisible: false }));
  }, []);

  return {
    flowState,
    toastState,
    openPromoCodeModal,
    closePromoCodeModal,
    handleApply,
    handleConfirmApply,
    handleVerifyAndUse,
    handleCancel,
    hideToast,
    isLoading: flowState.isLoading,
    error: flowState.error,
  };
};
