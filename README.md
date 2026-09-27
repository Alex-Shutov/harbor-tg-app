# Harbor Telegram Mini App

Городская культура: места, события, лояльность, задания и магазин привилегий.

## Параметры среды

| Параметр    | Описание      | Обязательный | Значение по умолчанию |
| ----------- | ------------- | ------------ | --------------------- |
| BACKEND_URL | Адрес бэкенда | ✅            |                       |
| VITE_USE_MOCKS | Включить моки API | ❌ | `true` |

## Продакшн

1. Скопировать `.env.example` в `.env`
2. Изменить параметры в `.env` под себя
3. Сбилдить и поднять фронтенд:

```sh
docker compose -f docker-compose.dev.yml up -d
# или
docker compose up -d

docker build -t harbor-tg-app .
docker run -d -p 80:80 harbor-tg-app
```

## Разработка

```sh
npm install
npm run dev
npm run lint
```
