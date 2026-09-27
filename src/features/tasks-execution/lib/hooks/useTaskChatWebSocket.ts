import { useEffect, useRef, useState, useCallback } from 'react';
import { retrieveLaunchParams } from '@telegram-apps/sdk-react';
import { IOtherTaskMessage } from '@/entities/tasks';

interface MessageUpdateNotification {
  taskId: number;
  telegramAccountId: number;
}

// const parseUrl = (urlString: string): URL | null => {
//   try {
//     return new URL(urlString);
//   } catch {
//     return null;
//   }
// };

export const useTaskChatWebSocket = (
  taskId: number | null,
  onMessageUpdate: (messages: IOtherTaskMessage[]) => void
) => {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const launchParams = retrieveLaunchParams();
  const telegramAccountId = launchParams?.tgWebAppData?.user?.id;

  const connect = useCallback(() => {
    if (!taskId || !telegramAccountId) {
      return;
    }

    // Закрываем существующее подключение если есть
    if (wsRef.current) {
      wsRef.current.close();
    }

    const websocketUrl: string | undefined = (() => {
      // if (!url) return;

      return ``;
    })();

    if (!websocketUrl) {
      console.error('Failed to construct WebSocket URL');
      return;
    }

    try {
      const ws = new WebSocket(websocketUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        reconnectAttempts.current = 0;

        // Подписываемся на обновления сообщений
        const subscription = `/tasks/${taskId}/accounts/${telegramAccountId}/messages`;
        ws.send(JSON.stringify({
          type: 'SUBSCRIBE',
          destination: subscription,
        }));
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // Обрабатываем уведомление об обновлении сообщений
          if (data.type === 'MESSAGE_UPDATE' || data.type === 'MessageUpdateNotification') {
            const notification: MessageUpdateNotification = data;
            
            // Если это уведомление для нашего задания, запрашиваем обновленные сообщения
            if (notification.taskId === taskId && notification.telegramAccountId === telegramAccountId) {
              // Здесь можно либо запросить сообщения через API, либо они придут в следующем сообщении
              // Пока просто вызываем callback - предполагаем, что сообщения будут обновлены через API
              onMessageUpdate([]);
            }
          } else if (data.messages && Array.isArray(data.messages)) {
            // Если пришли сообщения напрямую
            onMessageUpdate(data.messages);
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);

        // Пытаемся переподключиться
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current += 1;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        } else {
          console.error('Max reconnection attempts reached');
        }
      };
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      setIsConnected(false);
    }
  }, [taskId, telegramAccountId, onMessageUpdate]);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connect]);

  const sendMessage = useCallback((message: string, fileIds?: number[]) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'SEND_MESSAGE',
        taskId,
        message,
        fileIds: fileIds || [],
      }));
    }
  }, [taskId]);

  return {
    isConnected,
    sendMessage,
  };
};


