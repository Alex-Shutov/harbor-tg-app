FROM node:20.18.1-alpine3.21 AS build
WORKDIR /app

# Копируем и устанавливаем зависимости
COPY package.json package-lock.json /app/
RUN npm install

# Копируем оставшиеся файлы и запускаем сборку
COPY ./ /app
RUN npm run build

# Финальный образ с Nginx
FROM nginx:1.21.0-alpine

# Обновление зависимостей, установка пакетов, очистка проекта
RUN apk update \
  && apk add jq \
  && rm -rf /usr/share/nginx/html/*

# Очистка и копирование файлов
COPY --from=build /app/dist /usr/share/nginx/html
COPY ./shell-scripts/run-container.sh /usr/share/nginx/html
COPY ./allowed_env_vars.json /usr/share/nginx/html

RUN chmod +x /usr/share/nginx/html/run-container.sh

# Настройка Nginx
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx/nginx.conf /etc/nginx/conf.d/

EXPOSE 80
CMD ["/usr/share/nginx/html/run-container.sh"]
