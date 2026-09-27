import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
 
navigator.vibrate  = navigator.vibrate ||
  (navigator as any).webkitVibrate ||
  (navigator as any).mozVibrate ||
  (navigator as any).msVibrate;

export const useSwipeBack = (route:string|-1 = -1) => {
 const navigate = useNavigate();
 const threshold = 100

  useEffect(() => {
    let startX: number | null = null;
    let endX: number | null = null;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };

    const handleTouchMove = (e: TouchEvent) => {
      endX = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
      if (startX !== null && endX !== null) {
        const deltaX = endX - startX;

        // Если свайп слева направо (и достаточно большой)
        if (deltaX > threshold) {
          navigate(route as never)
          if (navigator.vibrate) {
            // vibration API supported

            navigator.vibrate(100);
          }
        }
      }

      startX = null;
      endX = null;
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [navigate, threshold]);
};