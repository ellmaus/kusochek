import React, { useEffect, useMemo, useState } from 'react'
import { ENERGY_LEVELS, FILTERS, productById } from '../data.js'
import { matchRecipes } from '../store.js'
import { Header, RecipeCard } from '../components.jsx'

const PAGE = 8
const nameOf = (id) => (productById[id] ? productById[id].name.toLowerCase() : id)

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
    veg: !!settings.veg,
  })
  const [shuffle, setShuffle] = useState(0)
  const [visible, setVisible] = useState(PAGE)

  const level = ENERGY_LEVELS.find((l) => l.id === energy)
  const matches = useMemo(() => {
    const list = matchRecipes({ energy, owned, filters })
    // Кнопка «обновить» немного меняет порядок
    if (shuffle > 0 && list.length > 1) {
      const k = (shuffle * PAGE) % list.length
      return [...list.slice(k), ...list.slice(0, k)]
    }
    return list
  }, [energy, owned, filters, shuffle])

  // При смене фильтров показываем список с начала
  useEffect(() => setVisible(PAGE), [energy, owned, filters])

  const toggleFilter = (id) => setFilters((f) => ({ ...f, [id]: !f[id] }))
  const activeCount = Object.values(filters).filter(Boolean).length
  const shown = matches.slice(0, visible)

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

      <div className="filters-wrap">
        <div className="chips filters scroll">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              className={`chip ${filters[f.id] ? 'chip-on' : ''}`}
              onClick={() => toggleFilter(f.id)}
              aria-pressed={!!filters[f.id]}
            >
              {f.label}
              {filters[f.id] && <span className="chip-mark">×</span>}
            </button>
          ))}
        </div>
        {activeCount > 0 && (
          <button className="link" onClick={() => setFilters({})}>
            Сбросить фильтры
          </button>
        )}
      </div>

      {matches.length === 0 ? (
        <div className="card empty">
          <div className="empty-emoji">🫖</div>
          <h3>Пока ничего не нашлось</h3>
          <p className="muted">
            {owned.length === 0
              ? 'Добавь хотя бы пару продуктов, которые есть дома — и мы подберём еду.'
              : 'Попробуй убрать часть фильтров, выбрать другой уровень энергии или добавить ещё продукты.'}
          </p>
          <button className="btn btn-primary" onClick={onProducts}>
            Добавить продукты
          </button>
        </div>
      ) : (
        <>
          <p className="muted">
            Нашлось вариантов: {matches.length}
          </p>
          <div className="list">
            {shown.map(({ recipe, missing }) => (
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
          {visible < matches.length && (
            <button className="btn btn-soft" onClick={() => setVisible((v) => v + PAGE)}>
              Показать ещё
            </button>
          )}
        </>
      )}
    </div>
  )
}
