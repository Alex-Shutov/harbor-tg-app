import { createMemoryHistory } from 'history';

export const history = createMemoryHistory();

export function attachTelegramNavigator(telegramEvents: any) {
  telegramEvents?.on('navigate', (path: string) => {
    history.push(path);
  });
}

export function detachTelegramNavigator(telegramEvents: any) {
  telegramEvents?.off('navigate');
}
