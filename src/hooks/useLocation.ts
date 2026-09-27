import { useEffect, useState } from 'react';
import { locationManager } from '@telegram-apps/sdk';

interface LocationData {
  latitude: number;
  longitude: number;
  altitude: number | null;
  course: number | null;
  speed: number | null;
  horizontal_accuracy: number | null;
  vertical_accuracy: number | null;
  course_accuracy: number | null;
  speed_accuracy: number | null;
}

interface UseLocationResult {
  location: LocationData | null;
  isLoading: boolean;
  error: string | null;
  requestLocation: () => Promise<void>;
  isInitialized: boolean;
}

export const useWebAppLocation = (): UseLocationResult => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeLocationManager = async () => {
      if (locationManager.mount.isAvailable()) {
        try {
          await locationManager.mount();
          console.log('locationManager mounted',locationManager);
          setIsInitialized(true);
        } catch (err) {
          console.warn('Ошибка инициализации LocationManager, будет использована браузерная геолокация:', err);
          // Не устанавливаем ошибку, так как у нас есть фолбек на браузерную геолокацию
          setIsInitialized(false);
        }
      } else {
        // LocationManager недоступен, но это не критично - есть фолбек
        console.log('LocationManager недоступен, будет использована браузерная геолокация');
        setIsInitialized(false);
      }
    };

    initializeLocationManager();
  }, []);

  const getBrowserLocation = (): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Геолокация не поддерживается браузером'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData: LocationData = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            altitude: position.coords.altitude,
            course: null,
            speed: position.coords.speed,
            horizontal_accuracy: position.coords.accuracy,
            vertical_accuracy: position.coords.altitudeAccuracy,
            course_accuracy: null,
            speed_accuracy: null
          };
          resolve(locationData);
        },
        (error) => {
          let errorMessage;
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Доступ к геолокации запрещен';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Информация о местоположении недоступна';
              break;
            case error.TIMEOUT:
              errorMessage = 'Истекло время ожидания запроса геолокации';
              break;
            default:
              errorMessage = 'Произошла ошибка при получении геолокации';
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    });
  };

  const requestLocation = async () => {
    setIsLoading(true);
    setError(null);
    console.log (isInitialized,'isInitialized',locationManager.requestLocation.isAvailable());
    try {
      // Пытаемся использовать Telegram LocationManager, если доступен
      if (isInitialized && locationManager.requestLocation.isAvailable()) {
        try {
          const telegramLocation = await locationManager.requestLocation();
          console.log (telegramLocation,'location');

          if (telegramLocation) {
            setLocation(telegramLocation);
            return;
          }
        } catch (e) {
          console.warn('Ошибка получения геолокации через Telegram API, пробуем браузерную геолокацию',e);
          // Продолжаем выполнение для фолбека
        }
      }

      // Фолбек: используем браузерную геолокацию
      const browserLocation = await getBrowserLocation();
      setLocation(browserLocation);
    } catch (e) {
      console.error('Ошибка при получении геолокации:', e);
      setError(e instanceof Error ? e.message : 'Не удалось получить геолокацию');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    location,
    isLoading,
    error,
    requestLocation,
    isInitialized
  };
};
