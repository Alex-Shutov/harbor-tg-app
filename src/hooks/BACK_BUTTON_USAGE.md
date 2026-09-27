# Использование кнопки "Назад"

## Обзор

Система управления кнопкой "назад" использует стек обработчиков, что позволяет:
- Автоматически управлять видимостью кнопки на основе роутинга
- Перехватывать обработку кнопки вложенными компонентами (модалки, лайтбоксы)
- Задавать кастомные обработчики для каждой страницы

## Основные хуки

### 1. `useAutoBackNavigation()` - Автоматическая навигация

Используйте на страницах, где нужна стандартная навигация назад:

```tsx
import { useAutoBackNavigation } from '@/hooks/useAutoBackNavigation';

export const MyPage: React.FC = () => {
  useAutoBackNavigation(); // Автоматически вернет на предыдущую страницу
  
  return <div>...</div>;
};
```

### 2. `useBackButtonStack()` - Кастомный обработчик

Используйте когда нужна кастомная логика:

```tsx
import { useBackButtonStack } from '@/hooks/useBackButtonStack';
import { useNavigate } from 'react-router-dom';

export const MyPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Кастомная навигация
  useBackButtonStack(() => {
    navigate('/custom-path');
  });
  
  return <div>...</div>;
};
```

### 3. Перехват обработки (для модалок, лайтбоксов)

Используйте высокий приоритет для перехвата:

```tsx
import { useBackButtonStack } from '@/hooks/useBackButtonStack';

export const MyModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  // Приоритет 100 - перехватывает обработку у страницы
  useBackButtonStack(() => {
    onClose(); // Закрываем модалку вместо навигации
  }, 100);
  
  return <div>...</div>;
};
```

## Примеры

### Пример 1: Страница с автоматической навигацией

```tsx
import { useAutoBackNavigation } from '@/hooks/useAutoBackNavigation';

export const BonusesPage: React.FC = () => {
  useAutoBackNavigation();
  
  return <div>...</div>;
};
```

### Пример 2: Страница с кастомной навигацией

```tsx
import { useBackButtonStack } from '@/hooks/useBackButtonStack';
import { useNavigate, useParams } from 'react-router-dom';

export const BookPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  useBackButtonStack(() => {
    navigate(`/establishment/${id}`);
  });
  
  return <div>...</div>;
};
```

### Пример 3: Модалка/Лайтбокс

```tsx
import { useBackButtonStack } from '@/hooks/useBackButtonStack';

export const GalleryLightbox: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  // Высокий приоритет перехватывает обработку
  useBackButtonStack(() => {
    onClose();
  }, 100);
  
  return <div>...</div>;
};
```

## Обратная совместимость

Старые хуки `useBackButton()` и `useOnBackNavigation()` продолжают работать, но рекомендуется использовать новые:

- `useBackButton()` → используйте `useBackButtonStack()` или `useAutoBackNavigation()`
- `useOnBackNavigation()` → используйте `useBackButtonStack()`

## Настройка скрытых путей

В `App.tsx` можно настроить пути, на которых кнопка автоматически скрывается:

```tsx
<BackButtonProvider hiddenPaths={['/subscription', '/login']}>
  {children}
</BackButtonProvider>
```

