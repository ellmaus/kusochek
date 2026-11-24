"""Один процесс: FastAPI раздаёт собранный Mini App, бот работает в long polling."""
import asyncio
import logging
import os
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from .bot import build_bot, setup_bot

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
log = logging.getLogger("app")

BOT_TOKEN = os.environ.get("BOT_TOKEN", "").strip()
WEBAPP_URL = os.environ.get("WEBAPP_URL", "").strip()
STATIC_DIR = Path(os.environ.get("STATIC_DIR", "dist"))


@asynccontextmanager
async def lifespan(app: FastAPI):
    bot = None
    task = None
    if BOT_TOKEN and WEBAPP_URL.startswith("https://"):
        bot, dp = build_bot(BOT_TOKEN, WEBAPP_URL)
        await bot.delete_webhook(drop_pending_updates=True)
        await setup_bot(bot, WEBAPP_URL)
        task = asyncio.create_task(dp.start_polling(bot, handle_signals=False))
        log.info("Бот запущен")
    else:
        log.warning(
            "Бот НЕ запущен: нужны BOT_TOKEN и WEBAPP_URL, начинающийся с https://. "
            "Раздаётся только Mini App."
        )
    try:
        yield
    finally:
        if task:
            task.cancel()
            try:
                await task
            except (asyncio.CancelledError, Exception):
                pass
        if bot:
            await bot.session.close()


app = FastAPI(title="Маленькая кухня", lifespan=lifespan)


@app.get("/health")
async def health():
    return {"status": "ok"}


if (STATIC_DIR / "index.html").exists():
    app.mount("/assets", StaticFiles(directory=STATIC_DIR / "assets"), name="assets")

    @app.get("/{path:path}")
    async def spa(path: str):
        file = (STATIC_DIR / path).resolve()
        # Отдаём реальный файл из dist (иконки и т.п.), иначе — index.html
        if path and file.is_file() and STATIC_DIR.resolve() in file.parents:
            return FileResponse(file)
        return FileResponse(
            STATIC_DIR / "index.html", headers={"Cache-Control": "no-cache"}
        )
else:
    log.warning("Не найдена сборка фронтенда в %s — выполни `npm run build`", STATIC_DIR)
