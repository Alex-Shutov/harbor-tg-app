import React, { useEffect, useMemo, useState } from 'react';
import { BottomSheetWithImage, Button, StatusBadge } from '@shared/ui';
import { IAppActivityTask, IBookAndVisitTask, ITask, ITelegramChannelSubscriptionTask } from '@/entities/tasks';
import { useShare } from '@/features/spot-card/shareEstablishment';
import { EPageType } from '@shared/constants';
import './task-details-modal.scss';
import { useNavigate } from 'react-router-dom';

interface TaskDetailsModalProps {
  task: ITask ;
  isOpen: boolean;
  isExecuting: boolean;
  showExecuteButton: boolean;
  showResendButton: boolean;
  showResendOtherButton: boolean;
  showChatButton: boolean;
  onClose: () => void;
  onExecuteFromDetails: () => Promise<void>;
  onOpenSubmit: () => void;
  onOpenChat: () => void;
}

const asBookAndVisitTask = (task: ITask | null): IBookAndVisitTask | null =>
  task && task.type === 'BOOK_AND_VISIT_ESTABLISHMENT'
    ? (task as IBookAndVisitTask)
    : null;

const asActivityTask = (task: ITask | null): IAppActivityTask | null =>
  task && task.type === 'APP_ACTIVITY'
    ? (task as IAppActivityTask)
    : null;


const getTaskTypeLabel = (task: ITask): string => {
  switch (task.type) {
    case 'BOOK_AND_VISIT_ESTABLISHMENT':
      return 'Забронировать и посетить заведение';
    case 'APP_ACTIVITY':
      return 'Активность в приложении';
    case 'TELEGRAM_CHANNEL_SUBSCRIPTION':
      return 'Подписка на ТГ канал';
    case 'OTHER':
      return 'Другое';
    default:
      return 'Задание';
  }
};

const getTaskStatusAndType = (task: ITask): {value:string,label:'success' | 'warning' | 'error'} => {
  switch (task.status) {
    case 'ACTIVE':
      return {value:'Активно',label:'success'};
    case 'REVIEW':
      return {value:'На проверке',label:'warning'};
    case 'REJECTED':
      return {value:'Отклонено',label:'error'};
    case 'COMPLETED':
      return {value:'Завершено',label:'success'};
    case 'COMPLETED_AS_FULFILLED':
      return {value:'Выполнено',label:'success'};

  }
};


export const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  task,
  isOpen,
  isExecuting,
  showExecuteButton,
  showChatButton, showResendOtherButton,showResendButton,
  onClose,
  onExecuteFromDetails,
  onOpenSubmit,
  onOpenChat,
}) => {

  const [localChannels, setLocalChannels] = useState((task as ITelegramChannelSubscriptionTask)?.channels || []);


  const navigate = useNavigate();

  const isChannelSubscription = task?.type === 'TELEGRAM_CHANNEL_SUBSCRIPTION';


  useEffect(() => {
    if (task && 'channels' in task) {
      setLocalChannels(task.channels);
    }
  }, [(task as ITelegramChannelSubscriptionTask)?.channels]);

  const { handleShare } = useShare({
    title: task.title,
    text: 'Посмотри, что я нашел!',
    pageType: EPageType.TASK,
    entityId: task.id,
  });



  const bookTask = asBookAndVisitTask(task);

  const appActivityTask = asActivityTask(task);


  const statusValueTypePair = useMemo(()=>{
    return task && getTaskStatusAndType(task);
  },[task])


  const handleExecuteClick = async () => {

    if (task.type === 'OTHER') {
      onOpenSubmit();
    } else {
        await onExecuteFromDetails();

    }

  };
  const handleNavigateToEstablishment = (id:number|undefined) => {
    if (id) navigate(`/establishment/${id}`);
  }

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
    <BottomSheetWithImage
      isOpen={isOpen}
      onClose={onClose}
      mainImage={task.image?.url ?? ''}
      imageAlt={task.title}
      title={task.title}
      onShare={handleShare}
    >
      <div className="task-details">
        <p className="task-details__description">{task.description}</p>
        <div className="task-details__section">
          <span className="task-details__label">Тип задания:</span>
          <span className="task-details__value">
            {getTaskTypeLabel(task)}
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

        {bookTask && (
          <div className="task-details__section">
            <span className="task-details__label">Заведение:</span>
            <span onClick={()=>handleNavigateToEstablishment(bookTask?.establishmentId)} className="task-details__value task-details__value--link">
              {bookTask.establishmentName}
            </span>
          </div>
        )}

        {appActivityTask && (
          <div className="task-details__section">
            <span className="task-details__label">Дней в приложении:</span>
            <span  className="task-details__value ">
              {appActivityTask.numberOfDaysOfActivity}/{appActivityTask.countOfDays}
            </span>
          </div>
        )}


        {/*<div className="task-details__section">*/}
        {/*  <span className="task-details__label">Участников:</span>*/}
        {/*  <span className="task-details__value">{participantsText}</span>*/}
        {/*</div>*/}

        <div className="task-details__section">
          <span className="task-details__label">Повторное выполнение:</span>
          <span className="task-details__value">Нет</span>
        </div>

        <div className="task-details__section">
          <span className="task-details__label">Награда:</span>
          <span className="task-details__value">
            Плюшка в заведении
          </span>
        </div>
        {statusValueTypePair && <StatusBadge value={statusValueTypePair.value} type={statusValueTypePair.label}/> }
        {task.status === 'REJECTED' && task.rejectionReason &&
          <div className={'task-details__inline-section'}>
            <span className={'task-details__label'}>Причина отклонения</span>
            <span className={'task-details__value task-details__value--rejection'}>{task.rejectionReason}</span>
          </div>}


        {showExecuteButton && (
          <Button
            type="primary"
            fullWidth
            disabled={isExecuting}
            onClick={handleExecuteClick}
          >
            {isExecuting ? 'Выполняем...' : 'Выполнить'}
          </Button>
        )}

        {showChatButton && (
          <Button type="outline" fullWidth onClick={onOpenChat}>
            Написать в чат
          </Button>
        )}

        {showResendOtherButton && (
          <Button
            type="primary"
            fullWidth
            onClick={handleExecuteClick}
          >
            {'Отравить повторно на проверку'}
          </Button>
        )}

        {showResendButton && (
          <Button
            type="primary"
            fullWidth
            onClick={handleExecuteClick}
          >
            {'Повторно участвовать'}
          </Button>
        )}
      </div>
    </BottomSheetWithImage>
  );
};



