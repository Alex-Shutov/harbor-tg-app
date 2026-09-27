// pages/SubscriptionFlow/index.tsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './index.scss';
import Button from '../../shared/Button';
import Skeleton from 'react-loading-skeleton';
import ToastMessage from '../../components/ToastMessage';
import { ChannelData } from '../../providers/subscription.mock.ts';

interface SubscriptionFlowProps {
  subscriptionState: 'checking' | 'needSubscribe' | 'notSubscribed' | 'confirmed';
  onCheckSubscription: () => Promise<void>;
  onNavigateToApp?: () => void;
  channels: ChannelData[];
}

const SubscriptionFlow = ({
                            subscriptionState,
                            onCheckSubscription,
                            onNavigateToApp,
                            channels
                          }: SubscriptionFlowProps) => {
  const [initialImageLoaded, setInitialImageLoaded] = useState(false);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [localChannels, setLocalChannels] = useState<ChannelData[]>([]);



  useEffect(() => {
    if (subscriptionState === 'checking' || subscriptionState === 'notSubscribed' || subscriptionState === 'confirmed') {
      setToastVisible(true);
    } else if (subscriptionState === 'needSubscribe') {
      setToastVisible(false);
    }
  }, [subscriptionState]);

  useEffect(() => {
    setLocalChannels(channels);
  }, [channels]);

  const handleCheckSubscription = async () => {
    setIsCheckingSubscription(true);
    setToastVisible(true);
    try {
      await onCheckSubscription();
    } finally {
      setIsCheckingSubscription(false);
    }
  };

  const getToastConfig = () => {
    switch (subscriptionState) {
      case 'checking':
        return {
          key:'checking',
          title: 'Загрузка...',
          description: 'Проверяем подписаны ли вы на все каналы',
          icon: '/subsribe.gif',
          showCloseButton: false,
          duration: 2000
        };

      case 'notSubscribed':
        return {
          key:'notSubscribed',

          title: 'Не выполнены условия',
          description: 'Вы подписались не на все каналы',
          icon: '/empty.gif',
          showCloseButton: true,
          duration: 0
        };

      case 'confirmed':
        return {
          key:'confirmed',

          title: 'Успешно!',
          description: 'Теперь вы можете пользоваться сервисом!',
          icon: '/subscribe-confirmed.gif',
          showCloseButton: false,
          duration: 3000
        };

      default:
        return null;
    }
  };


  const toastConfig = getToastConfig();

  const openTelegramChannel = (channelUrl: string, channelCode: string) => {
    // Optimistic update - сразу помечаем как подписанный
    setLocalChannels(prev => prev.map(ch =>
      ch.code === channelCode ? { ...ch, isSubscribed: true } : ch
    ));

    if (window.Telegram?.WebApp?.openTelegramLink) {
      try {
        window.Telegram.WebApp.openTelegramLink(channelUrl);
        return;
      } catch (error) {
        console.warn('Failed to open Telegram link, falling back to window.open:', error);
      }
    }
    // Фолбек: открываем в новой вкладке
    window.open(channelUrl, '_blank', 'noopener,noreferrer');
  };

  const handleToastClose = () => {
    setToastVisible(false);
  };

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

  const listAnimation = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2
      }
    }
  };



  return (
    <div className="subscription-flow">
      <motion.div
        variants={containerAnimation}
        initial="hidden"
        animate="show"
        className="subscription-flow__content"
      >
        <motion.div variants={itemAnimation} className="subscription-flow__header">
          {!initialImageLoaded && (
            <Skeleton
              height={120}
              width={120}
              borderRadius="50%"
              className="subscription-flow__icon-skeleton"
            />
          )}
          <img
            style={{ display: initialImageLoaded ? 'block' : 'none' }}
            onLoad={() => setInitialImageLoaded(true)}
            onError={() => setInitialImageLoaded(true)}
            className="subscription-flow__main-icon"
            src="/subscribe-hello.gif"
            alt="Duck"
          />
          <h2 className="subscription-flow__title">
            Чтобы пользоваться сервисом, нужно подписаться
          </h2>
        </motion.div>

        {localChannels.length > 0 && (
          <motion.div variants={itemAnimation} className="subscription-flow__channels-container">
            <motion.div
              variants={listAnimation}
              className="subscription-flow__channels-list"
            >
              {localChannels.map((channel) => (
                <motion.div
                  key={channel.code}
                  variants={itemAnimation}
                  className="subscription-flow__channel-item"
                >
                  <div className="subscription-flow__channel-info">
                    <div className="subscription-flow__channel-avatar">
                      {channel.imgUrl ? (
                        <img
                          src={channel.imgUrl}
                          alt={channel.title}
                          className="subscription-flow__channel-img"
                        />
                      ) : (
                        <div className="subscription-flow__channel-placeholder">
                          {channel.title.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div className="subscription-flow__channel-details">
                      <h3 className="subscription-flow__channel-name">
                        {channel.title}
                      </h3>
                    </div>
                  </div>

                  <div className="subscription-flow__channel-action">
                    {channel.isSubscribed ? (
                      <div className="subscription-flow__subscribed-badge">
                        <img src="/checked.svg" alt="checked" />
                      </div>
                    ) : (
                      <Button
                        type="primary"
                        onClick={() => openTelegramChannel(channel.url, channel.code)}
                        className="subscription-flow__subscribe-btn"
                      >
                        Подписаться
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        <motion.div className="subscription-flow__button-container" variants={itemAnimation}>
          {subscriptionState === 'confirmed' ? (
            <Button type="primary" onClick={onNavigateToApp}>
              Перейти в приложение
            </Button>
          ) : (
            <Button
              type="primary"
              onClick={handleCheckSubscription}
              disabled={isCheckingSubscription}
            >
              Проверить
            </Button>
          )}
        </motion.div>
      </motion.div>

      {toastConfig && (
        <ToastMessage
          isVisible={toastVisible}
          title={toastConfig.title}
          description={toastConfig.description}
          icon={toastConfig.icon}
          showCloseButton={toastConfig.showCloseButton}
          duration={toastConfig.duration}
          onVisibilityChange={(visible) => {
            setToastVisible(visible);
          }}
          onClose={handleToastClose}
        />
      )}
    </div>
  );
};

export default SubscriptionFlow;
