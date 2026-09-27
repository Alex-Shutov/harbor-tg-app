import { UserProfile } from '../pages/Account/account.types.ts';
import { User } from '@telegram-apps/sdk';

export const formatTelegramUser = (user: User): UserProfile => {
  return {
    id: user.id,
    displayName: user.first_name + (user.last_name ? ` ${user.last_name}` : ''),
    username: user.username ? `@${user.username}` : `id${user.id}`,
    photoUrl: user.photo_url || null
  };
};

export const cleanHistoryIfFromSubscription = (): void => {
  if (wasSubscriptionVisited() && window.location.pathname === '/') {
    cleanNavigationHistory();
  }
};

export const cleanNavigationHistory = (): void => {
  try {
    const navigationStateKey = 'app-navigation-state';
    const stateJson = sessionStorage.getItem(navigationStateKey);

    if (!stateJson) return;

    const state = JSON.parse(stateJson);

    if (!state.history || !Array.isArray(state.history) || state.history.length === 0) return;

    // Находим первую запись с непустым search параметром
    let firstEntryWithSearch = state.history.find((entry:any) => entry.search && entry.search !== '');

    // Если такой записи нет, берем первую запись
    if (!firstEntryWithSearch) {
      firstEntryWithSearch = state.history[0];
    }

    // Создаем новую историю только с первой записью
    state.history = [firstEntryWithSearch];
    state.index = 0;

    // Сохраняем обновленное состояние
    sessionStorage.setItem(navigationStateKey, JSON.stringify(state));

    console.log('Navigation history cleared successfully');
  } catch (error) {
    console.error('Error cleaning navigation history:', error);
  }
};

export const wasSubscriptionVisited = (): boolean => {
  try {
    const navigationStateKey = 'app-navigation-state';
    const stateJson = sessionStorage.getItem(navigationStateKey);

    if (!stateJson) return false;

    const state = JSON.parse(stateJson);

    if (!state.history || !Array.isArray(state.history)) return false;

    return state.history.some((entry:any) => entry.pathname === '/subscription');
  } catch (error) {
    console.error('Error checking subscription history:', error);
    return false;
  }
};