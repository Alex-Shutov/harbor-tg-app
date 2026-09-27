# Deep Link Filter Pattern

Механизм для обработки deep links с автоматической установкой фильтров на страницах.

## Как это работает

1. При переходе по share ссылке `useDeepLinking` редиректит на страницу с параметром (например, `/profile/tasks?taskId=123`)
2. На странице хук списка (например, `useTasksList`) проверяет параметр URL
3. Находит нужную сущность по ID
4. Определяет нужный фильтр на основе статуса/свойств сущности
5. Устанавливает фильтр
6. Открывает модалку с найденной сущностью

## Примеры реализации

### Для задач (Tasks)

**useDeepLinking.ts:**
```typescript
if (type === EPageType.TASK) {
  navigate(`/profile/tasks?taskId=${id}`, { replace: true });
  return;
}
```

**useTasksList.ts:**
```typescript
// Определяем вкладку по статусу
const getTabByStatus = (status: ITaskStatus): TasksTab => {
  if (status === 'ACTIVE') return 'ACTIVE';
  if (status === 'REVIEW') return 'REVIEW';
  if (['COMPLETED', 'COMPLETED_AS_FULFILLED', 'REJECTED'].includes(status)) return 'COMPLETED';
  return 'ACTIVE';
};

// Обработка deep link фильтра
useEffect(() => {
  const taskId = searchParams.get('taskId');
  if (taskId && !hasAppliedFilterRef.current && tasks.length > 0) {
    const id = parseInt(taskId, 10);
    const task = tasks.find(t => t.id === id);
    if (task) {
      hasAppliedFilterRef.current = true;
      const tab = getTabByStatus(task.status);
      setActiveTab(tab);
      
      // Отправляем событие для открытия модалки
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent('open-task-modal-from-deeplink', { detail: { taskId: id } }));
      }, 100);
      
      // Удаляем параметр из URL
      searchParams.delete('taskId');
      window.history.replaceState({}, '', `${window.location.pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`);
    }
  }
}, [tasks, searchParams]);
```

### Для розыгрышей (Giveaways)

**useDeepLinking.ts:**
```typescript
if (type === EPageType.GIVEAWAY) {
  navigate(`/profile/raffles?giveawayId=${id}`, { replace: true });
  return;
}
```

**RafflesList.tsx:**
```typescript
// Определяем вкладку по розыгрышу
const getTabByGiveaway = (giveaway: IGiveaway, data: IGiveawayListResponse): TabType => {
  if (data.active.some(g => g.id === giveaway.id)) return 'active';
  if (data.participating.some(g => g.id === giveaway.id)) return 'participating';
  if (data.completed.some(g => g.id === giveaway.id)) return 'completed';
  if (data.prizes.some(g => g.id === giveaway.id)) return 'prizes';
  return 'active';
};

// Обработка deep link фильтра
useEffect(() => {
  const giveawayId = searchParams.get('giveawayId');
  if (giveawayId && !hasAppliedFilterRef.current && data) {
    const id = parseInt(giveawayId, 10);
    const allGiveaways = [...data.active, ...data.participating, ...data.completed, ...data.prizes];
    const giveaway = allGiveaways.find(g => g.id === id);
    if (giveaway) {
      hasAppliedFilterRef.current = true;
      const tab = getTabByGiveaway(giveaway, data);
      setActiveTab(tab);
      
      setTimeout(() => {
        openModal(giveaway);
      }, 100);
      
      searchParams.delete('giveawayId');
      window.history.replaceState({}, '', `${window.location.pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`);
    }
  }
}, [data, searchParams, openModal]);
```

## Шаги для добавления новой сущности

1. **Добавить тип в EPageType:**
   ```typescript
   export enum EPageType {
     // ...
     NEW_ENTITY = 'new_entity',
   }
   ```

2. **Обновить useDeepLinking:**
   ```typescript
   if (type === EPageType.NEW_ENTITY) {
     navigate(`/path/to/page?entityId=${id}`, { replace: true });
     return;
   }
   ```

3. **Добавить обработку в хук списка:**
   - Использовать `useSearchParams` для получения параметра
   - Найти сущность по ID
   - Определить нужный фильтр
   - Установить фильтр
   - Открыть модалку (если нужно)

4. **Обновить share.utils.ts:**
   - Добавить текст для нового типа в `generateShareText`

## Паттерны

- Используйте `useRef` для отслеживания, был ли применен фильтр (чтобы не применять повторно)
- Удаляйте параметр из URL после применения фильтра
- Используйте небольшую задержку (100ms) перед открытием модалки, чтобы фильтр успел примениться
- Для открытия модалки можно использовать события или прямые вызовы функций




