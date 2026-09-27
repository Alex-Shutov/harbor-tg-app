// pages/ChatIdRequiredFlow/index.tsx
import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import './index.scss';
import Button from '../../shared/Button';
import Skeleton from 'react-loading-skeleton';

interface ChatIdRequiredFlowProps {
  onCheckChatId: () => Promise<void>;
  onContinue: () => void;
}

const BOT_USERNAME = 'harbor_demo_bot';
const BOT_URL = `https://t.me/${BOT_USERNAME}?start=start`;

const ChatIdRequiredFlow = ({
  onCheckChatId,
}: ChatIdRequiredFlowProps) => {
  const [initialImageLoaded, setInitialImageLoaded] = useState(false);
  const [isCheckingChatId, setIsCheckingChatId] = useState(false);

  const handleCheckChatId = useCallback(async () => {
    setIsCheckingChatId(true);
    try {
      await onCheckChatId();
    } finally {
      setIsCheckingChatId(false);
    }
  }, [onCheckChatId]);

  // Автоматически проверяем chatId при возврате в приложение (только один раз)
  useEffect(() => {
    let hasChecked = false;
    let timeoutId: NodeJS.Timeout | null = null;

    const handleVisibilityChange = () => {
      // Проверяем только если приложение стало видимым и еще не проверяли
      if (document.visibilityState === 'visible' && !isCheckingChatId && !hasChecked) {
        hasChecked = true;
        // Небольшая задержка, чтобы дать время боту обработать /start
        timeoutId = setTimeout(() => {
          handleCheckChatId();
        }, 1500);
      }
    };

    // Небольшая задержка перед добавлением слушателей, чтобы избежать мерцания
    const initTimeout = setTimeout(() => {
      document.addEventListener('visibilitychange', handleVisibilityChange);
      window.addEventListener('focus', handleVisibilityChange);
    }, 500);

    return () => {
      clearTimeout(initTimeout);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleVisibilityChange);
    };
  }, [isCheckingChatId, handleCheckChatId]);

  const containerAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const openTelegramBot = () => {
    if (window.Telegram?.WebApp?.openTelegramLink) {
      try {
        window.Telegram.WebApp.openTelegramLink(BOT_URL);
        return;
      } catch (error) {
        console.warn('Failed to open Telegram link, falling back to window.open:', error);
      }
    }
    // Фолбек: открываем в новой вкладке
    window.open(BOT_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="chat-id-required-flow">
      <motion.div
        variants={containerAnimation}
        initial="hidden"
        animate="show"
        className="chat-id-required-flow__content"
      >
        <motion.div variants={itemAnimation} className="chat-id-required-flow__header">
          {!initialImageLoaded && (
            <Skeleton
              height={120}
              width={120}
              borderRadius="50%"
              className="chat-id-required-flow__icon-skeleton"
            />
          )}
          <img
            style={{ display: initialImageLoaded ? 'block' : 'none' }}
            onLoad={() => setInitialImageLoaded(true)}
            onError={() => setInitialImageLoaded(true)}
            className="chat-id-required-flow__main-icon"
            src="/subscribe-hello.gif"
            alt="Bot"
          />
          <h2 className="chat-id-required-flow__title">
            Подключите Telegram-бота для получения уведомлений
          </h2>
          <p className="chat-id-required-flow__description">
            Чтобы получать важные уведомления и обновления, необходимо подписаться на нашего бота
          </p>
        </motion.div>

        <motion.div variants={itemAnimation} className="chat-id-required-flow__info-box">
          <div className="chat-id-required-flow__info-item">
            <div className="chat-id-required-flow__info-icon">📱</div>
            <div className="chat-id-required-flow__info-text">
              <strong>Откройте бота</strong>
              <span>Нажмите кнопку ниже, чтобы перейти к боту</span>
            </div>
          </div>
          <div className="chat-id-required-flow__info-item">
            <div className="chat-id-required-flow__info-icon">▶️</div>
            <div className="chat-id-required-flow__info-text">
              <strong>Отправьте /start</strong>
              <span>Команда отправится автоматически</span>
            </div>
          </div>
          <div className="chat-id-required-flow__info-item">
            <div className="chat-id-required-flow__info-icon">✅</div>
            <div className="chat-id-required-flow__info-text">
              <strong>Вернитесь в приложение</strong>
              <span>Нажмите "Проверить" после подписки</span>
            </div>
          </div>
        </motion.div>

        <motion.div className="chat-id-required-flow__button-container" variants={itemAnimation}>
          <Button
            type="primary"
            onClick={openTelegramBot}
            className="chat-id-required-flow__open-bot-btn"
          >
            Перейти к боту
          </Button>
          <Button
            type="outline"
            onClick={handleCheckChatId}
            disabled={isCheckingChatId}
            className="chat-id-required-flow__check-btn"
          >
            {isCheckingChatId ? 'Проверяем...' : 'Проверить разрешение'}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ChatIdRequiredFlow;

