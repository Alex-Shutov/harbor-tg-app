import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseButton } from '../CloseButton';
import './modal.scss';

interface IModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  title: string | React.ReactNode;
  children: React.ReactNode;
  align?: 'start' | 'end' | 'center';
  withOverlay?: boolean;
  hasOnCloseButton?: boolean;
}

export const Modal: React.FC<IModalProps> = ({
                                               align = 'center',
                                               onClose,
                                               title,
                                               children,
                                               withOverlay = true,
  hasOnCloseButton = true,
  isOpen = true,
                                             }) => {

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (
      e.target instanceof HTMLElement &&
      e.target.classList.contains('modal-overlay') &&
      onClose
    ) {
      onClose();
    }
  };

  const modalContent = (
    <motion.div
      className="modal-content"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="modal-header">
        {typeof title === 'string' ? (
          <div className="modal-header__title">{title}</div>
        ) : (
          title
        )}
        {onClose && hasOnCloseButton && (
          <CloseButton
            onClick={onClose}
            className="modal-header__close"
            aria-label="Close modal"
          />
        )}
      </div>
      <div className="modal-body">{children}</div>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        withOverlay ? (
          <motion.div
            className="modal-overlay"
            style={{ alignItems: align }}
            onClick={handleOverlayClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {modalContent}
          </motion.div>
        ) : (
          modalContent
        )
      )}
    </AnimatePresence>
  );
};
