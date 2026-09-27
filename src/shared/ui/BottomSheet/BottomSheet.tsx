import React, { useEffect } from 'react';
import { CloseButton } from '../CloseButton';
import './bottom-sheet.scss';

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  closeOnOverlayClick?: boolean;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
                                                          isOpen,
                                                          onClose,
                                                          title,
                                                          children,
                                                          closeOnOverlayClick = true,
                                                        }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="bottom-sheet-overlay" onClick={handleOverlayClick}>
      <div className="bottom-sheet">
        <div className="bottom-sheet__header">
          {title && <h2 className="bottom-sheet__title">{title}</h2>}
          <CloseButton
            onClick={onClose}
            className="bottom-sheet__close"
            aria-label="Закрыть"
            size="medium"
          />
        </div>

        <div className="bottom-sheet__content">{children}</div>
      </div>
    </div>
  );
};
