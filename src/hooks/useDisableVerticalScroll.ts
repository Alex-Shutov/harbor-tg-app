import  { useEffect } from 'react';
import { swipeBehavior } from '@telegram-apps/sdk';

const useDisableVerticalScroll = () => {

  useEffect(() => {
    try {
      if (swipeBehavior.isSupported() && swipeBehavior.mount.isAvailable()) {
        swipeBehavior.mount()
        swipeBehavior.disableVertical()
      }
    } catch (error) {
      console.warn('Failed to disable vertical swipe:', error);
    }
  },[])

};

export default useDisableVerticalScroll;