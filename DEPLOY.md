# Выкладка «Маленькой кухни» на сервер

Один контейнер = Mini App + бот. Caddy сам выдаёт HTTPS (Telegram требует его).

## Что нужно

- VPS с Linux (Ubuntu 22.04+, от 1 ГБ RAM) и публичным IP
- Домен (или поддомен) с A-записью на IP сервера
- Токен бота от @BotFather (`/newbot`)

## Шаги

1. **Docker на сервере** (один раз):
   ```bash
   curl -fsSL https://get.docker.com | sh
   ```
2. **Загрузи проект** на сервер (`scp -r`, git clone или распакуй архив) и перейди в папку.
3. **Настрой окружение:**
   ```bash
   cp .env.example .env
   nano .env      # впиши BOT_TOKEN и DOMAIN (например kitchen.example.com)
   ```
4. **Открой порты 80 и 443** в файрволе (`ufw allow 80,443/tcp`).
5. **Запусти:**
   ```bash
   docker compose up -d --build
   ```
6. **Проверь:**
   - `https://<твой-домен>/health` отвечает `{"status":"ok"}`
   - `https://<твой-домен>/` открывает приложение
   - `docker compose logs -f app` показывает «Бот запущен»
7. **В Telegram** напиши боту `/start`. Кнопка «Кухня» рядом с полем ввода и команды в меню настроятся автоматически.

## Обновление

```bash
git pull   # или залей новые файлы
docker compose up -d --build
```

## Важно

- Запускай **один** экземпляр: бот работает через long polling, два процесса с одним токеном будут конфликтовать.
- Данные пользователя (продукты, избранное) пока хранятся в localStorage на его устройстве, на сервер не отправляются.
- Если приложение не открывается в Telegram: проверь, что адрес начинается с `https://` и сертификат выдан (`docker compose logs caddy`).
- Токен бота никому не показывай. Если он утёк, перевыпусти его в @BotFather (`/revoke`).

## Запуск без Docker (альтернатива)

```bash
npm install && npm run build
cd server && python3 -m venv .venv && . .venv/bin/activate
pip install -r requirements.txt
cd ..
BOT_TOKEN=... WEBAPP_URL=https://твой-домен STATIC_DIR=dist \
  PYTHONPATH=server uvicorn app.main:app --host 0.0.0.0 --port 8000
```

HTTPS при этом настраивай сам (nginx + certbot или Caddy).

## Локальный тест с настоящим ботом

Запусти приложение (см. выше) и открой туннель: `cloudflared tunnel --url http://localhost:8000`.
Подставь полученный https-адрес в `WEBAPP_URL`.
