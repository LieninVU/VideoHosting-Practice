# Используем официальный образ Node.js для сборки приложения
FROM node:18-alpine AS builder

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы зависимостей
COPY video_hosting/package*.json ./

# Устанавливаем зависимости
RUN npm ci --only=production

# Копируем исходный код
COPY video_hosting/ .

# Собираем приложение для продакшн
RUN npm run build

# Используем nginx для обслуживания собранного приложения
FROM nginx:alpine

# Копируем собранные файлы из предыдущего этапа в директорию nginx
COPY --from=builder /app/build /usr/share/nginx/html

# Копируем конфигурационный файл nginx для настройки CORS и других параметров
COPY ./nginx.conf /etc/nginx/nginx.conf

# Открываем порт 80
EXPOSE 80

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]