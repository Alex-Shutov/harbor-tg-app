import axios from 'axios';

export const http = axios.create({
  baseURL: import.meta.env.VITE_APP_URL
});

let isAuthenticating = false;
let pendingRequests: any[] = [];

http.interceptors.request.use((config) => {

  const session = localStorage.getItem('sessionId');
  if (session) {
    config.headers.Authorization = `${session}`;
  }
  return config;
});

http.interceptors.response.use(
  (response) => {
    if (response.config.url === '/authentication' && response.data?.sessionId) {
      localStorage.setItem('sessionId', response.data.sessionId);

      // Проверяем hasChatId и отправляем событие, если его нет
      if (response.data?.hasChatId === false) {
        window.dispatchEvent(new CustomEvent('chat-id-required'));
      }

      if (isAuthenticating) {
        // Небольшая задержка, чтобы дать время localStorage обновиться
        setTimeout(() => {
          retryPendingRequests();
        }, 100);
      }
    }
    return response;
  },
  (error) => {
    const originalRequest = error.config;

    // Проверяем, является ли этот запрос проверкой подписки
    const isSubscriptionCheckRequest = originalRequest.url === '/subscription/check';

    // Проверяем на ошибки аутентификации
    if (!isSubscriptionCheckRequest && // Исключаем /subscription/check из обработки
      (([401, 403].includes(error.response?.status) && !originalRequest._retry) ||
        (error.response?.status === 400 &&
          error?.response.data?.errorCode === 'USER_IS_NOT_SUBSCRIBE_ON_CHANNEL'))) {

      // Перенаправляем только если еще не аутентифицируемся
      if (!isAuthenticating) {
        isAuthenticating = true;
        originalRequest._retry = true;
        pendingRequests.push(originalRequest);

        window.dispatchEvent(new CustomEvent('force-subscription-flow'));
      } else if (!originalRequest._retry) {
        // Если уже идет аутентификация, добавляем в очередь
        originalRequest._retry = true;
        pendingRequests.push(originalRequest);
        return new Promise(() => {}); // Запрос останется в подвешенном состоянии
      }
    }

    return Promise.reject(error);
  }
);

export const retryPendingRequests = () => {
  isAuthenticating = false;
  const requests = [...pendingRequests];
  pendingRequests = [];

  window.dispatchEvent(new CustomEvent('auth-completed'));

  // Теперь выполняем отложенные запросы
  requests.forEach(req => {
    http(req);
  });
};
