import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './styles.css'

// Подготовка Telegram Mini App (безопасно, если открыто просто в браузере)
try {
  const tg = window.Telegram?.WebApp
  if (tg) {
    tg.ready()
    tg.expand()
    tg.setHeaderColor?.('#FFF6EA')
    tg.setBackgroundColor?.('#FFF6EA')
  }
} catch (e) {
  /* ignore */
}

createRoot(document.getElementById('root')).render(<App />)
