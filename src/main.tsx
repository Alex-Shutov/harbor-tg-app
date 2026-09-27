import { createRoot } from 'react-dom/client';
import './styles/index.css';
import '@telegram-apps/telegram-ui/dist/styles.css';
import { Root } from './components/Root.tsx';
import { init as initSdk, initData } from '@telegram-apps/sdk';
import { backButton, miniApp, viewport } from '@telegram-apps/sdk-react';
import { setupMocks } from './shared/api/mocks/setupMocks.ts';
import { setupMockEnv } from './shared/mockEnv.ts';
import { DemoPhoneShell } from './demo/DemoPhoneShell.tsx';
import './demo/demo-phone.scss';

setupMocks();

const showPhoneFrame =
  import.meta.env.VITE_USE_MOCKS === 'true' &&
  new URLSearchParams(window.location.search).get('app') !== '1';


export function init(): void {
  try {
    initSdk();
  } catch (error) {
    console.warn('Failed to initialize SDK:', error);
    // Продолжаем выполнение, так как некоторые функции могут работать без полной инициализации
  }

  // Mount all components used in the project with fallbacks
  try {
    if (backButton.isSupported() && backButton.mount.isAvailable()) {
      backButton.mount();
    }
  } catch (error) {
    console.warn('Failed to mount backButton:', error);
  }

  try {
    if (viewport.mount.isAvailable()) {
      viewport.mount().catch((e) => {
        console.warn('Something went wrong mounting the viewport', e);
      });
    }
  } catch (error) {
    console.warn('Failed to mount viewport:', error);
  }

  try {
    if (miniApp.mount.isAvailable()) {
      miniApp.mount();
    }
  } catch (error) {
    console.warn('Failed to mount miniApp:', error);
  }

  try {
    if (backButton.isSupported() && backButton.show.isAvailable()) {
      backButton.show();
    }
  } catch (error) {
    console.warn('Failed to show backButton:', error);
  }

  try {
    // Восстанавливаем данные инициализации из URL для аутентификации
    // Это критично для работы аутентификации
    initData.restore();
  } catch (error) {
    console.warn('Failed to restore initData:', error);
  }
}

if (showPhoneFrame) {
  createRoot(document.getElementById('root')!).render(<DemoPhoneShell />);
} else {
  setupMockEnv().finally(() => {
    init();
    createRoot(document.getElementById('root')!).render(<Root />);
  });
}
