import React, { useMemo, useState } from 'react'
import { CATEGORIES, PRODUCTS, POPULAR_IDS } from '../data.js'
import { Header } from '../components.jsx'

export default function Products({
  owned,
  customProducts,
  toggleProduct,
  addCustom,
  removeCustom,
  onBack,
}) {
  const [query, setQuery] = useState('')
  const [openCat, setOpenCat] = useState(null)
  const q = query.trim().toLowerCase()

  const allProducts = useMemo(
    () => [...PRODUCTS, ...customProducts],
    [customProducts],
  )
  const ownedProducts = allProducts.filter((p) => owned.includes(p.id))
  const results = q
    ? allProducts.filter((p) => p.name.toLowerCase().includes(q))
    : []
  const exactExists = allProducts.some((p) => p.name.toLowerCase() === q)

  const handleAdd = () => {
    addCustom(query.trim())
    setQuery('')
  }

  const Chip = ({ p }) => {
    const has = owned.includes(p.id)
    return (
      <button
        className={`chip ${has ? 'chip-on' : ''}`}
        onClick={() => toggleProduct(p.id)}
        aria-pressed={has}
      >
        <span>{p.emoji}</span>
        <span>{p.name}</span>
        <span className="chip-mark">{has ? '✓' : '+'}</span>
      </button>
    )
  }

  return (
    <div className="screen">
      <Header title="Мои продукты" onBack={onBack} />

      <div className="search">
        <span>🔍</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Найти продукт…"
          aria-label="Поиск продуктов"
        />
        {query && (
          <button className="clear" onClick={() => setQuery('')} aria-label="Очистить">
            ×
          </button>
        )}
      </div>

      <p className="muted small">Соль, масло и вода считаются, что есть всегда.</p>

      {q ? (
        <section className="section">
          <h2>Результаты поиска</h2>
          <div className="chips">
            {results.map((p) => (
              <Chip key={p.id} p={p} />
            ))}
          </div>
          {!exactExists && (
            <button className="btn btn-soft" onClick={handleAdd}>
              ＋ Добавить «{query.trim()}»
            </button>
          )}
        </section>
      ) : (
        <>
          <section className="section">
            <h2>Дома сейчас</h2>
            {ownedProducts.length === 0 ? (
              <p className="muted">
                Пока пусто. Выбери продукты ниже — достаточно того, что видишь
                прямо сейчас.
              </p>
            ) : (
              <div className="chips">
                {ownedProducts.map((p) => (
                  <span key={p.id} className="chip chip-on">
                    <span>{p.emoji}</span>
                    <span>{p.name}</span>
                    <button
                      className="chip-x"
                      onClick={() =>
                        p.custom ? removeCustom(p.id) : toggleProduct(p.id)
                      }
                      aria-label={`Убрать ${p.name}`}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </section>

          <section className="section">
            <h2>Популярное</h2>
            <div className="popular">
              {POPULAR_IDS.map((id) => {
                const p = PRODUCTS.find((x) => x.id === id)
                const has = owned.includes(id)
                return (
                  <button
                    key={id}
                    className={`pop ${has ? 'pop-on' : ''}`}
                    onClick={() => toggleProduct(id)}
                    aria-pressed={has}
                  >
                    <span className="pop-emoji">{p.emoji}</span>
                    <span>{p.name}</span>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="section">
            <h2>Категории</h2>
            <div className="cats">
              {CATEGORIES.map((c) => {
                const items = PRODUCTS.filter((p) => p.cat === c.id)
                const isOpen = openCat === c.id
                const count = items.filter((p) => owned.includes(p.id)).length
                return (
                  <div key={c.id} className="cat-block">
                    <button
                      className="cat-row"
                      onClick={() => setOpenCat(isOpen ? null : c.id)}
                      aria-expanded={isOpen}
                    >
                      <span className="cat-emoji">{c.emoji}</span>
                      <span className="cat-name">{c.label}</span>
                      {count > 0 && <span className="badge">{count}</span>}
                      <span className={`chev ${isOpen ? 'open' : ''}`}>›</span>
                    </button>
                    {isOpen && (
                      <div className="chips cat-items">
                        {items.map((p) => (
                          <Chip key={p.id} p={p} />
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        </>
      )}
    </div>
  )
}
