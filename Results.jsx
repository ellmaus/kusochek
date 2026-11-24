import React, { useMemo, useState } from 'react'
import { ENERGY_LEVELS, productById } from '../data.js'
import { matchRecipes } from '../store.js'
import { Header, RecipeCard } from '../components.jsx'

const FILTERS = [
  { id: 'noStove', label: 'Без плиты' },
  { id: 'quick', label: 'Быстро' },
  { id: 'simple', label: 'Просто' },
]

export default function Results({
  energy,
  owned,
  settings,
  favorites,
  toggleFav,
  onOpen,
  onBack,
  onProducts,
}) {
  const [filters, setFilters] = useState({
    noStove: !!settings.noStove,
    quick: false,
    simple: false,
    veg: !!settings.veg,
  })
  const [shuffle, setShuffle] = useState(0)

  const level = ENERGY_LEVELS.find((l) => l.id === energy)
  const matches = useMemo(() => {
    const list = matchRecipes({ energy, owned, filters })
    // Кнопка «обновить» немного меняет порядок среди равных вариантов
    if (shuffle > 0 && list.length > 1) {
      const k = shuffle % list.length
      return [...list.slice(k), ...list.slice(0, k)]
    }
    return list
  }, [energy, owned, filters, shuffle])

  const toggleFilter = (id) => setFilters((f) => ({ ...f, [id]: !f[id] }))

  return (
    <div className="screen">
      <Header
        title="Результаты"
        onBack={onBack}
        right={
          <button
            className="icon-btn"
            onClick={() => setShuffle((s) => s + 1)}
            aria-label="Показать другие варианты"
          >
            ↻
          </button>
        }
      />

      <div className="banner">
        <span className="banner-icon">⚡</span>
        <div>
          <div className="small">Твой уровень энергии:</div>
          <strong>{level?.label}</strong>
          <div className="small">{level?.hint}</div>
        </div>
      </div>

      <div className="chips filters">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            className={`chip ${filters[f.id] ? 'chip-on' : ''}`}
            onClick={() => toggleFilter(f.id)}
            aria-pressed={filters[f.id]}
          >
            {f.label}
            {filters[f.id] && <span className="chip-mark">×</span>}
          </button>
        ))}
      </div>

      {matches.length === 0 ? (
        <div className="card empty">
          <div className="empty-emoji">🫖</div>
          <h3>Пока ничего не нашлось</h3>
          <p className="muted">
            {owned.length === 0
              ? 'Добавь хотя бы пару продуктов, которые есть дома — и мы подберём еду.'
              : 'Попробуй убрать фильтры, выбрать другой уровень энергии или добавить ещё продукты.'}
          </p>
          <button className="btn btn-primary" onClick={onProducts}>
            Добавить продукты
          </button>
        </div>
      ) : (
        <div className="list">
          {matches.map(({ recipe, missing }) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              missing={missing.map(nameOf)}
              favorite={favorites.includes(recipe.id)}
              onToggleFav={() => toggleFav(recipe.id)}
              onOpen={() => onOpen(recipe.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const nameOf = (id) => (productById[id] ? productById[id].name.toLowerCase() : id)
