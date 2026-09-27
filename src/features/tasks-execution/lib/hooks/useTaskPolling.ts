import { useEffect, useRef } from 'react';
import { useGetTaskQuery } from '@/entities/tasks';
import { IOtherTask, IOtherTaskMessage } from '@/entities/tasks';

interface UseTaskPollingOptions {
  taskId: number | null;
  onTaskUpdate?: (task: IOtherTask) => void;
  onMessagesUpdate?: (messages: IOtherTaskMessage[]) => void;
  pollingInterval?: number; // Интервал поллинга в миллисекундах, по умолчанию 3000 (3 секунды)
  enabled?: boolean; // Включен ли поллинг, по умолчанию true
}

const isOtherTask = (task: any): task is IOtherTask =>
  !!task && task.type === 'OTHER';

export const useTaskPolling = ({
  taskId,
  onTaskUpdate,
  onMessagesUpdate,
  pollingInterval = 3000,
  enabled = true,
}: UseTaskPollingOptions) => {
  const previousMessagesRef = useRef<IOtherTaskMessage[]>([]);

  // Используем встроенный поллинг RTK Query
  const { data: task, isLoading } = useGetTaskQuery(taskId!, {
    skip: !taskId || !enabled,
    pollingInterval: enabled && taskId ? pollingInterval : 0,
  });

  // Обрабатываем обновления задачи и сообщений
  useEffect(() => {
    if (!task || !isOtherTask(task)) {
      return;
    }

    // Вызываем callback для обновления задачи
    if (onTaskUpdate) {
      onTaskUpdate(task);
    }

    // Проверяем, изменились ли сообщения
    const currentMessages = task.messages || [];
    const previousMessages = previousMessagesRef.current;

    // Сравниваем количество сообщений или их ID
    const messagesChanged =
      currentMessages.length !== previousMessages.length ||
      currentMessages.some(
        (msg, index) => msg.id !== previousMessages[index]?.id
      );

    if (messagesChanged && onMessagesUpdate) {
      onMessagesUpdate(currentMessages);
      previousMessagesRef.current = currentMessages;
    } else if (!messagesChanged) {
      // Обновляем ref даже если сообщения не изменились, чтобы синхронизировать состояние
      previousMessagesRef.current = currentMessages;
    }
  }, [task, onTaskUpdate, onMessagesUpdate]);

  return {
    task: task && isOtherTask(task) ? task : undefined,
    isLoading,
  };
};

