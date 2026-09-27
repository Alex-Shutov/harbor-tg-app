import React from 'react';
import ToastMessage from '@components/ToastMessage';
import { IPromocodeFlowState } from '@/entities/promocode/types';
import { PromoCodeModal } from '@/features/recievePromoCode';
import { PromocodeConfirm } from '@/features/recievePromoCode/ui/PromocodeConfirm.tsx';
import { PromoCodeCheckModal } from '@/features/recievePromoCode/ui/PromocodeCheckModal.tsx';
import './recieve-promo-code-flow.scss'

interface IReceivePromoCodeFlowProps {
  flowState: IPromocodeFlowState;
  isLoading: boolean;
  error?: string | null;
  onClose: () => void;
  onApply: () => void;
  onConfirmApply: () => void;
  onVerifyAndUse: (code: string) => Promise<void>;
  onCancel: () => void;
  toastState: any;
  onHideToast: () => void;
}

export const ReceivePromoCodeFlow: React.FC<IReceivePromoCodeFlowProps> = ({
                                                                             flowState,
                                                                             isLoading,
                                                                             error,
                                                                             onClose,
                                                                             onApply,
                                                                             onConfirmApply,
                                                                             onVerifyAndUse,
                                                                             onCancel,
                                                                             toastState,
                                                                             onHideToast,
                                                                           }) => {
  return (
    <>
      {flowState.context === 'profile' ? (
        <PromoCodeModal
          context="profile"
          promoCode={flowState.selectedPromoCode}
          isOpen={flowState.selectedPromoCode !== null}
          onClose={onClose}
          onApply={onApply}
          isLoading={isLoading}
          onUsePromoCode={onVerifyAndUse}
          issuedAt={flowState.issuedAt}
          objectName={flowState.objectName || ''}
          objectId={flowState.objectId || 0}
        />
      ) : (
        <PromoCodeModal
          context="object"
          promoCode={flowState.selectedPromoCode}
          isOpen={flowState.selectedPromoCode !== null}
          onClose={onClose}
          onApply={onApply}
          isLoading={isLoading}
          onUsePromoCode={onVerifyAndUse}
          issuedAt={flowState.issuedAt}
        />
      )}

      <PromocodeConfirm
        isOpen={flowState.step === 'confirmation'}
        onConfirm={onConfirmApply}
        onCancel={onCancel}
        isLoading={isLoading}
      />

      <PromoCodeCheckModal
        onClose={onCancel}
        isOpen={flowState.step === 'codeInput'}
        onSubmit={onVerifyAndUse}
        isLoading={isLoading}
        error={error}
      />

      <ToastMessage
        className={'promocode-toast'}
        isVisible={toastState.isVisible}
        title={toastState.title}
        description={toastState.description}
        icon={toastState.icon}
        type={toastState.type}
        showCloseButton={toastState.showCloseButton}
        duration={toastState.duration}
        onClose={onHideToast}
        onVisibilityChange={(visible) => !visible && onHideToast()}
      />
    </>
  );
};
