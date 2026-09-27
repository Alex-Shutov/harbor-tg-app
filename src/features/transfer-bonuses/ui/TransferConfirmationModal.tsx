import React from 'react';
import { BottomSheet, Button, TextArea, UrbanWhiteOrangeIcon } from '@shared/ui';
import './transfer-confirmation-modal.scss';

interface ITransferConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  recipientTag: string;
  amount: number;
  commission: number;
  description: string;
  onDescriptionChange: (value: string) => void;
  isTransferring: boolean;
}

export const TransferConfirmationModal: React.FC<ITransferConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  recipientTag,
  amount,
  commission,
  description,
  onDescriptionChange,
  isTransferring,
}) => {
  const commissionAmount = (amount * commission) / 100;
  const recipientAmount = Math.round((amount - commissionAmount) * 100) / 100;

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Перевести бонусы">
      <div className="transfer-confirmation-modal">
        <div className="transfer-confirmation-modal__message">
          Проверьте данные перед подтверждением операции.
        </div>

        <div className="transfer-confirmation-modal__details">
          <div className="transfer-confirmation-modal__detail-row">
            <span className="transfer-confirmation-modal__detail-label">Кому:</span>
            <span className="transfer-confirmation-modal__detail-value">{recipientTag}</span>
          </div>

          <div className="transfer-confirmation-modal__detail-row">
            <span className="transfer-confirmation-modal__detail-label">Сумма:</span>
            <span className="transfer-confirmation-modal__detail-value">
              {amount} <UrbanWhiteOrangeIcon viewBox={'-4 0 28 28'} size={20} />
            </span>
          </div>

          <div className="transfer-confirmation-modal__detail-row">
            <span className="transfer-confirmation-modal__detail-label">Комиссия:</span>
            <span className="transfer-confirmation-modal__detail-value">{commission}%</span>
          </div>

          <div className="transfer-confirmation-modal__detail-row">
            <span className="transfer-confirmation-modal__detail-label">Получатель получит:</span>
            <span className="transfer-confirmation-modal__detail-value">
              {recipientAmount} <UrbanWhiteOrangeIcon viewBox={'-4 0 28 28'} size={20} />
            </span>
          </div>
        </div>

        <div className="transfer-confirmation-modal__description">
          <TextArea
            name="description"
            value={description}
            onChange={onDescriptionChange}
            label="Описание перевода"
            placeholder="Введите описание перевода"
          />
        </div>

        <div className="transfer-confirmation-modal__actions">
          <Button
            type="secondary"
            onClick={onClose}
            disabled={isTransferring}
          >
            Отмена
          </Button>
          <Button
            type="primary"
            onClick={onConfirm}
            disabled={isTransferring}
          >
            {isTransferring ? 'Переводим...' : 'Перевести'}
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
};

