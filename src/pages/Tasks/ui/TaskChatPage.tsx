import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  useGetTasksQuery, 
  useSendMessageForOtherTaskMutation,
  useUploadTempFileMutation 
} from '@/entities/tasks';
import { useTaskPolling } from '@/features/tasks-execution/lib/hooks/useTaskPolling';
import { IOtherTask, IOtherTaskMessage, ITaskStatus } from '@/entities/tasks';
import { TextArea, StatusBadge, Title, Image, FileInvoice } from '@shared/ui';
import { SendIcon, AttachIcon } from '@shared/ui/icons';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import './task-chat-page.scss';
import { useAutoBackNavigation } from '@hooks/useAutoBackNavigation.ts';
import { useBackButtonStack } from '@hooks/useBackButtonStack.ts';

const isOtherTask = (task: any): task is IOtherTask =>
  !!task && task.type === 'OTHER';

const getStatusText = (status: ITaskStatus): string => {
  switch (status) {
    case 'ACTIVE':
      return 'Активно';
    case 'REVIEW':
      return 'На проверке';
    case 'REJECTED':
      return 'Отклонено';
    case 'COMPLETED':
    case 'COMPLETED_AS_FULFILLED':
      return 'Выполнено';
    default:
      return status;
  }
};

const getStatusType = (status: ITaskStatus): 'success' | 'warning' | 'error' => {
  switch (status) {
    case 'ACTIVE':
    case 'COMPLETED':
    case 'COMPLETED_AS_FULFILLED':
      return 'success';
    case 'REVIEW':
      return 'warning';
    case 'REJECTED':
      return 'error';
    default:
      return 'success';
  }
};

export const TaskChatPage: React.FC = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<IOtherTaskMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [tempFiles, setTempFiles] = useState<{ file: File; id?: number }[]>([]);

  const navigate = useNavigate();

  const { refetch: refetchTasks } = useGetTasksQuery();
  const [sendMessageMutation] = useSendMessageForOtherTaskMutation();
  const [uploadTempFile] = useUploadTempFileMutation();

  const handleMessagesUpdate = (newMessages: IOtherTaskMessage[]) => {
    if (newMessages.length > 0) {
      setMessages(newMessages);
    }
  };

  const handleTaskUpdate = (updatedTask: IOtherTask) => {
    if (updatedTask.messages && updatedTask.messages.length > 0) {
      setMessages(updatedTask.messages);
    }
  };

  useAutoBackNavigation()
  useBackButtonStack(() => {
  if ((window as any).__navCount == 0) {
      navigate('/tasks');
    } else {
      navigate(-1);
    }
  }, 100);

  const { task } = useTaskPolling({
    taskId: taskId ? Number(taskId) : null,
    onTaskUpdate: handleTaskUpdate,
    onMessagesUpdate: handleMessagesUpdate,
    pollingInterval: 5000,
    enabled: !!taskId,
  });

  // Инициализируем сообщения из задачи при первой загрузке
  useEffect(() => {
    if (task && isOtherTask(task) && messages.length === 0) {
      setMessages(task.messages || []);
    }
  }, [task]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!taskId || (!messageText.trim() && tempFiles.length === 0)) {
      return;
    }

    try {
      const fileIds: number[] = [];
      for (const tempFile of tempFiles) {
        if (tempFile.id) {
          fileIds.push(tempFile.id);
        } else if (tempFile.file) {
          const formData = new FormData();
          formData.append('file', tempFile.file);
          const response = await uploadTempFile(formData).unwrap();
          fileIds.push(response.fileId);
        }
      }

      const newMessages = await sendMessageMutation({
        taskId: Number(taskId),
        message: messageText?.trim() ?? undefined ,
        fileIds: fileIds.length > 0 ? fileIds : undefined,
      }).unwrap();

      if (newMessages && newMessages.length > 0) {
        setMessages(newMessages);
      } else {
        await refetchTasks();
      }

      setMessageText('');
      setTempFiles([]);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files)
        .slice(0, 5 - tempFiles.length)
        .map((file) => ({ file }));
      setTempFiles((prev) => [...prev, ...newFiles]);
    }
    event.target.value = '';
  };

  const formatMessageDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'HH:mm', { locale: ru });
    } catch {
      return '';
    }
  };

  if (!task || !isOtherTask(task)) {
    return (
      <div className="task-chat-page">
        <div className="task-chat-page__error">Задание не найдено</div>
      </div>
    );
  }

  return (
    <div className="task-chat-page">
      <div className="task-chat-page__header-sticky">
        <div className="task-chat-page__header-content">
          {task.image?.url && (
            <div className="task-chat-page__header-image">
              <Image
                src={task.image.url}
                alt={task.title}
              />
            </div>
          )}
          <div className="task-chat-page__header-info">
            <Title className="task-chat-page__header-title">{task.title}</Title>
            <StatusBadge
              value={getStatusText(task.status)}
              type={getStatusType(task.status)}
            />
          </div>
        </div>
      </div>

      <div className="task-chat-page__messages">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`task-chat-page__message ${
              message.isMine ? 'task-chat-page__message--mine' : ''
            }`}
          >
            {message.type === 'TEXT' && message.text && (
              <div className="task-chat-page__message-text">{message.text}</div>
            )}

            {message.type === 'FILE_LIST' && message.files && (
              <div className="task-chat-page__message-files">
                {message.files.map((file) => (
                  <div key={file.id} className="task-chat-page__message-file">
                    <FileInvoice size={36}/>
                    <div className="task-chat-page__file-info">
                      <div className="task-chat-page__file-name">
                        {file.fileName || (file as any).name}
                      </div>
                      {(file.size || (file as any).sizeOfMb) && (
                        <div className="task-chat-page__file-size">
                          {file.size 
                            ? `${(file.size / (1024 * 1024)).toFixed(2)} МБ`
                            : `${(file as any).sizeOfMb} МБ`}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="task-chat-page__message-time">
              {formatMessageDate(message.createdDate)}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="task-chat-page__input">
        {tempFiles.length > 0 && (
          <div className="task-chat-page__files-preview">
            {tempFiles.map((tempFile, index) => (
              <div key={index} className="task-chat-page__file-preview">
                <span>{tempFile.file.name}</span>
                <button
                  onClick={() =>
                    setTempFiles((prev) => prev.filter((_, i) => i !== index))
                  }
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="task-chat-page__input-row">
          <label className="task-chat-page__attach-button">
            <input
              type="file"
              hidden
              onChange={handleFileSelect}
              disabled={tempFiles.length >= 5}
            />
            <AttachIcon size={24} />
          </label>

          <TextArea
            value={messageText}
            onChange={setMessageText}
            placeholder="Сообщение"
            className="task-chat-page__textarea"
          />

          <button
            onClick={handleSendMessage}
            disabled={(!messageText.trim() && tempFiles.length === 0)}
            className="task-chat-page__send-button"
          >
            <SendIcon size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

