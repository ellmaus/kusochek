# Маленькая кухня — Telegram Mini App + бот

- `src/` — frontend (React + Vite), данные в `src/data.js`, подбор в `src/store.js`
- `server/` — FastAPI (раздаёт приложение) + бот на aiogram
- `Dockerfile`, `docker-compose.yml`, `Caddyfile` — выкладка на сервер

Разработка frontend:

```bash
npm install
npm run dev
```

Выкладка на сервер: см. [DEPLOY.md](DEPLOY.md).
