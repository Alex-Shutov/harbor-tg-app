import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_URL,
  timeout: 30000,
});

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const session =  localStorage.getItem('sessionId');
    if (session && config.headers) {
      config.headers.Authorization = session;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isAuthenticating = false;
let pendingRequests: Array<() => void> = [];

apiClient.interceptors.response.use(
  async (response) => {
    if (response.config.url === '/authentication' && response.data?.sessionId) {
       localStorage.setItem('sessionId', response.data.sessionId);
      if (isAuthenticating) {
        isAuthenticating = false;
        pendingRequests.forEach(callback => callback());
        pendingRequests = [];
      }
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    const isSubscriptionCheck = originalRequest.url === '/subscription/check';
    if (isSubscriptionCheck) {
      return Promise.reject(error);
    }

    const isAuthError =
      [401, 403].includes(error.response?.status || 0) ||
      (error.response?.status === 400 &&
        (error.response?.data as any)?.errorCode === 'USER_IS_NOT_SUBSCRIBE_ON_CHANNEL');

    if (isAuthError && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isAuthenticating) {
        isAuthenticating = true;

        window.dispatchEvent(new CustomEvent('force-subscription-flow'));

        return new Promise((resolve, reject) => {
          const handleAuthCompleted = () => {
            window.removeEventListener('auth-completed', handleAuthCompleted);
            apiClient(originalRequest).then(resolve).catch(reject);
          };
          window.addEventListener('auth-completed', handleAuthCompleted);

          pendingRequests.push(() => {
            handleAuthCompleted();
          });
        });
      } else {
        return new Promise((resolve, reject) => {
          pendingRequests.push(() => {
            apiClient(originalRequest).then(resolve).catch(reject);
          });
        });
      }
    }

    return Promise.reject(error);
  }
);

export const completeAuthentication = () => {
  window.dispatchEvent(new CustomEvent('auth-completed'));
};
