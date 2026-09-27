import React, { useState } from 'react';
import { Modal } from '@shared/ui';
import { Button } from '@shared/ui';
import './UpdateRequiredModal.scss';
import Skeleton from 'react-loading-skeleton';

interface UpdateRequiredModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  minVersion: string;
  currentVersion?: string | null;
}

export const UpdateRequiredModal: React.FC<UpdateRequiredModalProps> = ({
  isOpen,
  setIsOpen
}) => {
  const [initialImageLoaded, setInitialImageLoaded] = useState(false);

  const handleUpdateClick = () => {

    if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      window.open('https://apps.apple.com/app/telegram/id686449807', '_blank');
    }
    else if (/Android/i.test(navigator.userAgent)) {
      window.open('https://play.google.com/store/apps/details?id=org.telegram.messenger', '_blank');
    }
    else {
      window.open('https://desktop.telegram.org/', '_blank');
    }
  };
  if (!isOpen) return null;

  return (
    <div className={'update-required-modal-container'}>
    <Modal
      title={''}
      align="center"
      onClose={()=>setIsOpen(false)}
      hasOnCloseButton={true}
    >

      <div className="update-required-modal">
        {!initialImageLoaded && (
          <Skeleton
            height={120}
            width={120}
            className="update-required-modal__skeleton"
          />
        )}
        <img
          className={`update-required-modal__image`}
          style={{ display: initialImageLoaded ? 'block' : 'none' }}
          onLoad={() => setInitialImageLoaded(true)}
          onError={() => setInitialImageLoaded(true)}
          src="/umbrella.gif"
          alt="umbrella"
        />
        <div className="update-required-modal__content">
          <p className="update-required-modal__message">
            Приложение может работать некорректно!
          </p>
          <p className="update-required-modal__instruction">
            Ваша версия телеграм устарела, приложение может работать нестабильно
          </p>
        </div>
        <div className="update-required-modal__actions">
          <Button
            onClick={handleUpdateClick}
            type="secondary"
            fullWidth
          >
            Обновить приложение
          </Button>
        </div>
      </div>
    </Modal>
    </div>
  );
};

