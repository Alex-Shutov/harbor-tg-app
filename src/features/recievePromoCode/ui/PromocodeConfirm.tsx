import React from 'react';
import { Modal, Button, Subtitle } from '@shared/ui';
import './promo-code-confirm.scss';

interface IPromoCodeConfirmationModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export const PromocodeConfirm: React.FC<IPromoCodeConfirmationModalProps> = ({
                                                                                         isOpen,
                                                                                         onConfirm,
                                                                                         onCancel,
                                                                                         isLoading,
                                                                                       }) => {
  if (!isOpen) return null;

  return (
    <Modal onClose={onCancel} hasOnCloseButton={false} title="Применить промокод?" align="center" withOverlay>
      <div className="promo-confirmation-modal">
        <Subtitle className={'promo-confirmation-modal__subtitle'}>
          После подтверждения вы увидите промокод, который нельзя использовать повторно.
        </Subtitle>

        <div className="promo-confirmation-modal__buttons">
          <Button
            className={'promo-confirmation-modal__button outline'}
            type="outline"
            fullWidth
            onClick={onCancel}
            disabled={isLoading}
          >
            Отмена
          </Button>
          <Button
            type="primary"
            fullWidth
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Применение...' : 'Применить'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
