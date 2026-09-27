import React, { useRef, useState } from 'react';
import { Modal, Button } from '@shared/ui';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { getHCaptchaSiteKey } from '@/utils/env';
import './captcha-modal.scss';

interface CaptchaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (token: string) => void;
  title?: string;
  description?: string;
}

export const CaptchaModal: React.FC<CaptchaModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = 'Подтвердите, что вы не робот',
  description = 'Пожалуйста, пройдите проверку безопасности',
}) => {
  const captchaRef = useRef<HCaptcha>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = (token: string) => {
    setIsVerifying(false);
    setError(null);
    onSuccess(token);
  };

  const handleError = () => {
    setIsVerifying(false);
    setError('Произошла ошибка при проверке. Попробуйте еще раз.');
    if (captchaRef.current) {
      captchaRef.current.resetCaptcha();
    }
  };

  const handleExpire = () => {
    setError(null);
    if (captchaRef.current) {
      captchaRef.current.resetCaptcha();
    }
  };

  const handleClose = () => {
    setError(null);
    setIsVerifying(false);
    if (captchaRef.current) {
      captchaRef.current.resetCaptcha();
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={title}
      hasOnCloseButton={true}
    >
      <div className="captcha-modal">
        {description && (
          <p className="captcha-modal__description">{description}</p>
        )}
        
        <div className="captcha-modal__captcha-wrapper">
          <HCaptcha
            ref={captchaRef}
            sitekey={getHCaptchaSiteKey()}
            onVerify={handleVerify}
            onError={handleError}
            onExpire={handleExpire}
            size="normal"
            theme="light"
          />
        </div>

        {error && (
          <div className="captcha-modal__error">{error}</div>
        )}

        <div className="captcha-modal__actions">
          <Button
            type="outline"
            fullWidth
            onClick={handleClose}
            disabled={isVerifying}
          >
            Отмена
          </Button>
        </div>
      </div>
    </Modal>
  );
};

