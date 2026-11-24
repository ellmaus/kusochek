# 1) Сборка фронтенда
FROM node:22-alpine AS web
WORKDIR /web
COPY package.json ./
RUN npm install
COPY index.html vite.config.js ./
COPY src ./src
COPY public ./public
RUN npm run build

# 2) Сервер: FastAPI + бот
FROM python:3.12-slim
WORKDIR /app
COPY server/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY server/app ./app
COPY --from=web /web/dist ./dist
ENV STATIC_DIR=/app/dist PYTHONUNBUFFERED=1
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
