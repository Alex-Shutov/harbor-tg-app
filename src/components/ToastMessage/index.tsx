import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import './toast.scss';

interface ToastMessageProps {
  isVisible: boolean; // Всегда контролируем извне
  title: string;
  description?: string;
  icon?: string;
  type?: 'loading' | 'error' | 'success';
  showCloseButton?: boolean;
  position?: 'bottom' | 'top';
  duration?: number;
  onClose?: () => void;
  className?: string;
  onVisibilityChange?: (visible: boolean) => void;
}

const ToastMessage = ({
                        isVisible,
                        title,
                        description,
                        icon,
                        type = 'loading',
                        showCloseButton = false,
                        position = 'bottom',
                        duration = 0,
                        onClose,
                        className,
                        onVisibilityChange
                      }: ToastMessageProps) => {
  const [currentContent, setCurrentContent] = useState({ title, description, icon, type });

  useEffect(() => {
    if (isVisible) {
      setCurrentContent({ title, description, icon, type });
    }
  }, [title, description, icon, type, isVisible]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isVisible && duration && duration > 0) {
      timer = setTimeout(() => {
        handleClose();
      }, duration);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isVisible, duration, title, description]);

  const handleClose = () => {
    onVisibilityChange?.(false);
    onClose?.();
  };
  const getIconContent = () => {
    if (!icon) return null;

    if (icon.startsWith('/') || icon.startsWith('http')) {
      return <img src={icon} alt="" className="toast-message__icon-img" />;
    }

    // Если это эмодзи
    return <span className="toast-message__icon-emoji">{icon}</span>;
  };

  const slideVariants = {
    hidden: {
      y: position === 'bottom' ? 100 : -100,
      opacity: 0,
      scale: 0.95
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        opacity: { duration: 0.2 }
      }
    },
    exit: {
      y: position === 'bottom' ? 50 : -50,
      opacity: 0,
      scale: 0.95,
      transition: {
        duration: 0.15,
        ease: "easeInOut"
      }
    }
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.15 }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`toast-message toast-message--${position} ${className}`}
          variants={slideVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className="toast-message__content"
            variants={contentVariants}
            key={`${currentContent.title}-${currentContent.description}`}
          >
            {/* Рендерим иконку только если она есть */}
            {getIconContent() && (
              <div className="toast-message__icon">
                {getIconContent()}
              </div>
            )}

            <div className="toast-message__text">
              <h3 className="toast-message__title">{currentContent.title}</h3>
              {currentContent.description && <p className="toast-message__description">{currentContent.description}</p>}
            </div>

            {showCloseButton && (
              <button
                className="toast-message__close"
                onClick={handleClose}
                aria-label="Закрыть"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path
                    d="M15 5L5 15M5 5L15 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ToastMessage;
