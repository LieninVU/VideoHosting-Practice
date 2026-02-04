# Используем официальный образ Node.js
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем файлы зависимостей
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --only=production

# Копируем исходный код сервера
COPY . .

# Создаем директорию для видеофайлов
RUN mkdir -p VideoFiles

# Открываем порт 3001
EXPOSE 3001

# Запускаем приложение
CMD ["node", "server.js"]