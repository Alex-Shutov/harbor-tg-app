import React, { useState } from 'react';
import { Modal, Button, Input, Subtitle } from '@shared/ui';
import './promo-code-check-modal.scss';

interface IPromoCodeVerificationModalProps {
  isOpen: boolean;
  onSubmit: (code: string) => Promise<void>;
  onClose: () => void;
  isLoading: boolean;
  error?: string | null;
}

export const PromoCodeCheckModal: React.FC<IPromoCodeVerificationModalProps> = ({
                                                                                         isOpen,
                                                                                         onSubmit,
                                                                                         onClose,
                                                                                         isLoading,
                                                                                         error,
                                                                                       }) => {
  const [code, setCode] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async () => {
      await onSubmit(code);
      setCode('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && code.length === 4 && !isLoading) {
      handleSubmit();
    }
  };

  return (
    <Modal hasOnCloseButton={false} onClose={onClose} title="Ввод кода" align="center" withOverlay>
      <div className="promo-verification-modal">
        <Subtitle className={'promo-verification-modal__subtitle'}>
          Введите код, который назовет официант, чтобы завершить применение промокода.
        </Subtitle>

        <Input
          label={'Код'}
          name="verificationCode"
          value={code}
          onChange={(_, value) => setCode(String(value))}
          type="text"
          placeholder="Введите код"
          customError={error}
          onKeyPress={handleKeyPress}
        />

        <div className="promo-verification-modal__buttons">
          <Button
            className={'promo-verification-modal__button outline'}
            type="outline"
            fullWidth
            onClick={onClose}
            disabled={isLoading}
          >
            Отмена
          </Button>
          <Button
            type="primary"
            fullWidth
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? 'Проверка...' : 'Применить'}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
