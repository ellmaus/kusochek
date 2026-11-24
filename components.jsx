import React from 'react'

// Круглая «иллюстрация» блюда из эмодзи на нежном фоне
export function Dish({ emoji, size = 'md' }) {
  return (
    <div className={`dish dish-${size}`} aria-hidden="true">
      <span className="dish-plate">
        <span className="dish-emoji">{emoji}</span>
      </span>
    </div>
  )
}

export function Header({ title, onBack, right }) {
  return (
    <header className="header">
      {onBack ? (
        <button className="icon-btn" onClick={onBack} aria-label="Назад">
          ‹
        </button>
      ) : (
        <span className="icon-btn ghost" />
      )}
      <h1 className="header-title">{title}</h1>
      {right || <span className="icon-btn ghost" />}
    </header>
  )
}

const TABS = [
  { id: 'home', label: 'Главная', icon: '🏠' },
  { id: 'products', label: 'Продукты', icon: '🧺' },
  { id: 'favorites', label: 'Избранное', icon: '🤍', iconActive: '💚' },
  { id: 'settings', label: 'Настройки', icon: '⚙️' },
]

export function TabBar({ active, onChange }) {
  return (
    <nav className="tabbar">
      {TABS.map((t) => (
        <button
          key={t.id}
          className={`tab ${active === t.id ? 'active' : ''}`}
          onClick={() => onChange(t.id)}
        >
          <span className="tab-icon">
            {active === t.id && t.iconActive ? t.iconActive : t.icon}
          </span>
          <span className="tab-label">{t.label}</span>
        </button>
      ))}
    </nav>
  )
}

export function RecipeCard({ recipe, missing = [], favorite, onToggleFav, onOpen }) {
  return (
    <article className="card recipe-card">
      <div className="recipe-pic">
        <Dish emoji={recipe.emoji} size="lg" />
        <button
          className={`heart ${favorite ? 'on' : ''}`}
          onClick={onToggleFav}
          aria-label={favorite ? 'Убрать из избранного' : 'В избранное'}
        >
          {favorite ? '♥' : '♡'}
        </button>
      </div>
      <div className="recipe-body">
        <h3>{recipe.title}</h3>
        <p className="meta">
          <span>🕒 {recipe.timeLabel}</span>
          <span>🥄 {recipe.actions} {actionsWord(recipe.actions)}</span>
        </p>
        <p className="muted">{recipe.desc}</p>
        {missing.length > 0 && (
          <p className="missing">Не хватает: {missing.join(', ')}</p>
        )}
        <button className="btn btn-soft" onClick={onOpen}>
          Открыть рецепт
        </button>
      </div>
    </article>
  )
}

export function actionsWord(n) {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return 'действие'
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'действия'
  return 'действий'
}

export function productsWord(n) {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return 'продукт'
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'продукта'
  return 'продуктов'
}

export function ideasWord(n) {
  const m10 = n % 10
  const m100 = n % 100
  if (m10 === 1 && m100 !== 11) return 'идея'
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'идеи'
  return 'идей'
}
