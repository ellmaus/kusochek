"""Telegram-бот «Маленькая кухня»: команды открывают Mini App на нужном экране."""
import logging

from aiogram import Bot, Dispatcher
from aiogram.filters import Command, CommandStart
from aiogram.types import (
    BotCommand,
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    MenuButtonWebApp,
    Message,
    WebAppInfo,
)

log = logging.getLogger("bot")


def build_bot(token: str, webapp_url: str) -> tuple[Bot, Dispatcher]:
    base = webapp_url.rstrip("/")
    bot = Bot(token=token)
    dp = Dispatcher()

    def open_button(label: str, query: str = "") -> InlineKeyboardMarkup:
        url = f"{base}/{query}"
        return InlineKeyboardMarkup(
            inline_keyboard=[[InlineKeyboardButton(text=label, web_app=WebAppInfo(url=url))]]
        )

    @dp.message(CommandStart())
    async def start(message: Message):
        name = message.from_user.first_name if message.from_user else "друг"
        await message.answer(
            f"Привет, {name}! 🍲\n\n"
            "Я помогу найти, что съесть, даже если почти нет сил готовить.\n"
            "Выбери, сколько у тебя энергии, отметь продукты, которые есть дома, "
            "— и получи простые идеи.\n\n"
            "Без сложных рецептов и чувства вины.",
            reply_markup=open_button("🍽️ Открыть «Маленькую кухню»"),
        )

    @dp.message(Command("food"))
    async def food(message: Message):
        await message.answer(
            "Давай найдём что-нибудь простое 🍽️",
            reply_markup=open_button("🍽️ Подобрать еду", "?screen=results"),
        )

    @dp.message(Command("fridge"))
    async def fridge(message: Message):
        await message.answer(
            "Что сейчас есть дома? 🧺",
            reply_markup=open_button("🧺 Мои продукты", "?tab=products"),
        )

    @dp.message(Command("favorite"))
    async def favorite(message: Message):
        await message.answer(
            "Твои сохранённые рецепты 💚",
            reply_markup=open_button("💚 Избранное", "?tab=favorites"),
        )

    @dp.message(Command("settings"))
    async def settings(message: Message):
        await message.answer(
            "Настройки питания и предпочтений ⚙️",
            reply_markup=open_button("⚙️ Настройки", "?tab=settings"),
        )

    @dp.message(Command("help"))
    async def help_(message: Message):
        await message.answer(
            "Как это работает:\n"
            "1. Выбери уровень энергии: мало, немного или много.\n"
            "2. Отметь продукты, которые есть дома.\n"
            "3. Нажми «Подобрать еду» и выбери подходящий вариант.\n\n"
            "Команды:\n"
            "/food — подобрать еду\n"
            "/fridge — мои продукты\n"
            "/favorite — избранное\n"
            "/settings — настройки",
            reply_markup=open_button("🍲 Открыть приложение"),
        )

    return bot, dp


async def setup_bot(bot: Bot, webapp_url: str) -> None:
    """Команды в меню бота и кнопка Mini App рядом с полем ввода."""
    base = webapp_url.rstrip("/")
    await bot.set_my_commands(
        [
            BotCommand(command="start", description="Начало работы"),
            BotCommand(command="food", description="Подобрать еду"),
            BotCommand(command="fridge", description="Мои продукты"),
            BotCommand(command="favorite", description="Избранные рецепты"),
            BotCommand(command="settings", description="Настройки"),
            BotCommand(command="help", description="Помощь"),
        ]
    )
    await bot.set_chat_menu_button(
        menu_button=MenuButtonWebApp(text="Кухня", web_app=WebAppInfo(url=f"{base}/"))
    )
    log.info("Бот настроен, Mini App: %s", base)
