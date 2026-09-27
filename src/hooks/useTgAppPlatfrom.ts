import { useMemo } from 'react';
import { requestFullscreen, retrieveLaunchParams } from '@telegram-apps/sdk-react';

const useTgAppPlatform = () => {
  const platform = useMemo(() => retrieveLaunchParams().tgWebAppPlatform, [])
  return {
    platform,
    canFullSize:requestFullscreen.isSupported() && requestFullscreen.isAvailable(),
    isMobile: platform === 'android' || platform === 'ios',
  }
};

export default useTgAppPlatform;