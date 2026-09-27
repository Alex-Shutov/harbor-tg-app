import React from 'react';
import { motion } from 'framer-motion';
import './Modal.scss';

interface IProps {
  onClose?: () => void;
  title: string | React.ReactNode;
  children: React.ReactNode;
  align?: 'start' | 'end' | 'center';
  withOverlay?: boolean;
}

const Modal: React.FC<IProps> = ({
                                   align = "center",
                                   onClose,
                                   title,
                                   children,
                                   withOverlay = true
                                 }) => {
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement &&
      e.target.classList.contains('modal-overlay') &&
      onClose) {
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
        {typeof title === 'string' ? <div className='title'>{title}</div> : title}
        <div className='close-container'>
          {onClose && (
            <button className="close-button" onClick={onClose}>
              &times;
            </button>
          )}
        </div>
      </div>
      <div className="modal-body">
        {children}
      </div>
    </motion.div>
  );

  return withOverlay ? (
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
  );
};

export default Modal;