import React, { useEffect, useState } from 'react';
import { IGiveaway, EParticipationType, EGiveawayStatus } from '@/entities/giveaway/types';
import { BottomSheetWithImage, Button } from '@/shared/ui';
import { IToastState } from '@/entities/promocode/types';
import ToastMessage from '@components/ToastMessage';
import { useShare } from '@/features/spot-card/shareEstablishment';
import { EPageType } from '@shared/constants';
import './giveaway-participate-modal.scss';

interface IGiveawayParticipateModalProps {
  giveaway: IGiveaway ;
  isOpen: boolean;
  onClose: () => void;
  onParticipate: () => void;
  isLoading: boolean;
  error?: string | null;
  userBalance?: number;
  toastState: IToastState;
  onHideToast: () => void;
}

const formatTimeRemaining = (endDateTime: string): string => {
  const end = new Date(endDateTime);
  const now = new Date();
  const diff = end.getTime() - now.getTime();

  if (diff <= 0) return 'Завершён';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const parts: string[] = [];

  if (days > 0) {
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;
    if (months > 0) {
      parts.push(`${months} ${months === 1 ? 'мес.' : months < 5 ? 'мес.' : 'мес.'}`);
    }
    if (remainingDays > 0) {
      parts.push(`${remainingDays} ${remainingDays === 1 ? 'д.' : 'д.'}`);
    }
  }

  if (hours > 0 && parts.length < 2) {
    parts.push(`${hours} ${hours === 1 ? 'ч.' : 'ч.'}`);
  }

  if (minutes > 0 && parts.length < 2) {
    parts.push(`${minutes} ${minutes === 1 ? 'мин.' : 'мин.'}`);
  }

  if (seconds > 0 && parts.length < 2) {
    parts.push(`${seconds} ${seconds === 1 ? 'с' : 'с'}`);
  }

  return parts.join(' ') || 'Меньше секунды';
};

const formatDateTime = (dateTime: string): string => {
  const date = new Date(dateTime);
  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const GiveawayParticipateModal: React.FC<IGiveawayParticipateModalProps> = ({
  giveaway,
  isOpen,
  onClose,
  onParticipate,
  isLoading,
  error,
  toastState,
  onHideToast,
}) => {
  const [localChannels, setLocalChannels] = useState(giveaway?.channels || []);
  useEffect(() => {
    if (giveaway?.channels) {
      setLocalChannels(giveaway.channels);
    }
  }, [giveaway?.channels]);

  const { handleShare } = useShare({
    title: giveaway.title,
    text: 'Посмотри, что я нашел!',
    pageType: EPageType.GIVEAWAY,
    entityId: giveaway.id,
  });

  const isChannelSubscription = giveaway.participationType === EParticipationType.CHANNEL_SUBSCRIPTION;
  const isPrize = giveaway.status === EGiveawayStatus.PRIZE;
  const isCompleted = giveaway.status === EGiveawayStatus.COMPLETED || isPrize;
  const hasWinners = giveaway.winners && giveaway.winners.length > 0;

  if (!giveaway) return null;


  const openTelegramChannelByName = (channelUrl: string) => {
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
  }

  const openTelegramChannel = (channelUrl: string, channelCode: string) => {
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
  return (
    <>
      <BottomSheetWithImage
        isOpen={isOpen}
        onClose={onClose}
        mainImage={giveaway.image.url}
        imageAlt={giveaway.title}
        title={giveaway.title}
        onShare={handleShare}
      >
        <div className="giveaway-modal">
          <p className="giveaway-modal__description">{giveaway.description}</p>

          <div className="giveaway-modal__info">
            <div className="giveaway-modal__section">
              <span className="giveaway-modal__label">Тип задания:</span>
              <span className="giveaway-modal__value">
                  {giveaway.participationType === 'CHANNEL_SUBSCRIPTION' ? 'Подписка на каналы' : 'Бесплатное участие'}
                </span>
            </div>




            {isChannelSubscription && localChannels.length > 0 && (
              <>
                {localChannels.map((channel, index) => (
                  <div key={channel.code} className="giveaway-modal__section">
                    <span className="giveaway-modal__label">
                      {localChannels.length === 1 ? 'Канал' : `Канал №${index + 1}`}
                    </span>
                    <span className="giveaway-modal__value fullsize">
                      <div className={'giveaway-modal__value__wrapper'}>
                        <span className={'link'} onClick={()=>openTelegramChannelByName(channel.url)}>{channel.title}</span>
                      {channel.isSubscribed ? (
                        <img src="/checked.svg" alt="checked" style={{ width: 20, height: 20 }} />
                      ) : (
                        <Button
                          className={'subscription-flow__subscribe-btn'}
                          type="primary"
                          size="small"
                          onClick={() => openTelegramChannel(channel.url, channel.code)}
                        >
                          Подписаться
                        </Button>
                      )}
                        </div>
                    </span>
                  </div>
                ))}
              </>
            )}

            {isCompleted ? (
              <>
                <div className="giveaway-modal__section">
                  <span className="giveaway-modal__label">Статус:</span>
                  <span className="giveaway-modal__value giveaway-modal__value--completed">
                    {isPrize ? 'Розыгрыш завершился, вы победитель!' : 'Розыгрыш завершился'}
                  </span>
                </div>

                <div className="giveaway-modal__section">
                  <span className="giveaway-modal__label">Количество победителей:</span>
                  <span className="giveaway-modal__value">
                    {giveaway.winnersCount}
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="giveaway-modal__section">
                  <span className="giveaway-modal__label">Осталось времени:</span>
                  <span className="giveaway-modal__value">
                    {formatTimeRemaining(giveaway.endDateTime)}
                  </span>
                </div>

                <div className="giveaway-modal__section">
                  <span className="giveaway-modal__label">Дата окончания:</span>
                  <span className="giveaway-modal__value">
                    {formatDateTime(giveaway.endDateTime)}
                  </span>
                </div>
                <div className="giveaway-modal__section">
                  <span className="giveaway-modal__label">Количество победителей:</span>
                  <span className="giveaway-modal__value">
                    {giveaway.winnersCount}
                  </span>
                </div>
              </>
            )}

            {isCompleted && hasWinners && (
              <div className="giveaway-modal__section winners">
                <span className="giveaway-modal__label">Победители:</span>
                <div className="giveaway-modal__value giveaway-modal__winners">
                  {[...giveaway.winners!]
                    .sort((a, b) => a.serialNumber - b.serialNumber)
                    .map((winner, index, sortedWinners) => (
                      <span key={winner.serialNumber} className="giveaway-modal__winner">
                        {winner.serialNumber + 1}. @{winner.username}
                        {index < sortedWinners.length - 1 && ','}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {/*<div className="giveaway-modal__section">*/}
            {/*  <span className="giveaway-modal__label">Уже участвуют:</span>*/}
            {/*  <span className="giveaway-modal__value">*/}
            {/*    {giveaway.participantsCount} из {giveaway.participantsLimit}*/}
            {/*  </span>*/}
            {/*</div>*/}
          </div>

          {error && (
            <div className="giveaway-modal__error">
              {error}
            </div>
          )}

          {!giveaway.isParticipant && !giveaway.isExpired && !isCompleted && <Button
            type="primary"
            fullWidth
            onClick={() => onParticipate()}
            disabled={isLoading}
          >
            {isLoading ? 'Участвуем...' : 'Участвовать'}
          </Button>}
        </div>
      </BottomSheetWithImage>

      <ToastMessage
        className={'giveaway-toast'}
        isVisible={toastState.isVisible}
        title={toastState.title}
        description={toastState.description}
        icon={toastState.icon}
        type={toastState.type}
        showCloseButton={toastState.showCloseButton}
        duration={toastState.duration}
        onClose={onHideToast}
        onVisibilityChange={(visible) => !visible && onHideToast()}
      />
    </>
  );
};


