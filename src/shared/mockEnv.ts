import {
  mockTelegramEnv,
  isTMA,
  retrieveLaunchParams,
} from '@telegram-apps/sdk';

// Mocks the Telegram Mini Apps environment so the app can be opened and
// tested in a plain browser (used together with VITE_USE_MOCKS=true).
// Only runs in development builds - tree-shaken out of production bundles.
export const setupMockEnv = async (): Promise<void> => {
  const mocksEnabled = import.meta.env.VITE_USE_MOCKS === 'true';
  if (!import.meta.env.DEV && !mocksEnabled) return;

  if (await isTMA()) {
    return;
  }

  let launchParams: any;
  try {
    launchParams = retrieveLaunchParams();
  } catch {
    const initDataRaw = new URLSearchParams([
      ['user', JSON.stringify({
        id: 99281932,
        first_name: 'Harbor',
        last_name: 'Tester',
        username: 'harbor_tester',
        language_code: 'ru',
        is_premium: false,
        allows_write_to_pm: true,
      })],
      ['hash', '89d6079ad6762351f38c6dbbc41bb53048019256a9443988af7a48bcad16ba31'],
      ['auth_date', Math.floor(Date.now() / 1000).toString()],
      ['signature', 'mock-signature'],
    ]).toString();

    const themeParams = {
      accent_text_color: '#6ab2f2',
      bg_color: '#17212b',
      button_color: '#5288c1',
      button_text_color: '#ffffff',
      destructive_text_color: '#ec3942',
      header_bg_color: '#17212b',
      hint_color: '#708499',
      link_color: '#6ab3f3',
      secondary_bg_color: '#232e3c',
      section_bg_color: '#17212b',
      section_header_text_color: '#6ab3f3',
      subtitle_text_color: '#708499',
      text_color: '#f5f5f5',
    } as const;

    launchParams = {
      tgWebAppThemeParams: themeParams,
      tgWebAppData: initDataRaw,
      tgWebAppVersion: '8',
      tgWebAppPlatform: 'tdesktop',
    };
  }

  mockTelegramEnv({ launchParams });

  (window as any).Telegram = (window as any).Telegram || {};
  (window as any).Telegram.WebApp = (window as any).Telegram.WebApp || {
    openTelegramLink: (url: string) => window.open(url, '_blank', 'noopener,noreferrer'),
    close: () => {},
    ready: () => {},
    expand: () => {},
  };

  console.warn(
    '⚠️ As long as the current environment was not considered as the Telegram-based one, it was mocked. Take a note, that you should not do it in production and current behavior is only specific to the development process. Environment mocking is also applied only in development mode. So, after building the application, you will not see this behavior and related warning, leading to crashing the application outside Telegram.',
  );
};
