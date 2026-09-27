import { useEffect } from 'react';
import { isViewportMounting, mountViewport, requestFullscreen } from '@telegram-apps/sdk-react';
import useTgAppPlatform from './useTgAppPlatfrom.ts';

export function useMobileFullscreen() {
  const {isMobile,canFullSize} = useTgAppPlatform();
  useEffect(() => {
    if (isMobile && mountViewport.isAvailable() && !isViewportMounting()) {
      try {
        mountViewport();
        if (canFullSize) {
          requestFullscreen();
        }
      } catch (error) {
        console.warn('Failed to set mobile fullscreen:', error);
      }
    }
  }, []);
}
