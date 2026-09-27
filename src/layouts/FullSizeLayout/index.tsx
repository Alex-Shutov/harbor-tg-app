import  { useLayoutEffect } from 'react';
import { Outlet } from 'react-router-dom';
import './layout.scss'
import { miniApp } from '@telegram-apps/sdk-react';
import useTgAppPlatform from '../../hooks/useTgAppPlatfrom.ts';

const Index = () => {
  const {isMobile,canFullSize} = useTgAppPlatform()
  useLayoutEffect(() => {
    if (isMobile && miniApp.setHeaderColor.isAvailable()) {
      try {
        miniApp.setHeaderColor('#EEF2F4');
      } catch (error) {
        console.warn('Failed to set header color:', error);
      }
    }
  },[])
  return (
    <div>
      {isMobile && canFullSize && <div className={'fullSize-layout'}>
        <p>Harbor</p>
      </div>}
      <Outlet />
    </div>
  );
};

export default Index;