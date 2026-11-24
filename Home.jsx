import React from 'react'
import { ENERGY_LEVELS } from '../data.js'
import { ideasWord, productsWord } from '../components.jsx'

export default function Home({
  energy,
  setEnergy,
  ownedNames,
  ideasCount,
  onPick,
  onProducts,
}) {
  const level = ENERGY_LEVELS.find((l) => l.id === energy)
  const preview = ownedNames.slice(0, 4).join(', ')

  return (
    <div className="screen">
      <section className="hero">
        <div className="hero-text">
          <h1>
            Маленькая
            <br />
            кухня 🍲
          </h1>
          <p>Еда, когда мало сил</p>
        </div>
        <div className="hero-art" aria-hidden="true">
          <span className="leaf leaf-1">🌿</span>
          <span className="leaf leaf-2">🪴</span>
          <span className="cat">🐈</span>
          <span className="cup">☕</span>
        </div>
      </section>

      <section className="section">
        <h2>Сколько у тебя сейчас сил?</h2>
        <div className="energy-row">
          {ENERGY_LEVELS.map((l) => (
            <button
              key={l.id}
              className={`energy ${energy === l.id ? 'active' : ''}`}
              onClick={() => setEnergy(l.id)}
              aria-pressed={energy === l.id}
            >
              <span className="energy-emoji">{l.emoji}</span>
              <span>{l.label}</span>
            </button>
          ))}
        </div>
        <p className="muted center">
          {level ? level.hint : 'Можно выбрать любое состояние'}
        </p>
      </section>

      <button className="card products-card" onClick={onProducts}>
        <span className="fridge">🧊</span>
        <span className="products-card-text">
          <strong>Мои продукты</strong>
          <span className="muted">
            {ownedNames.length
              ? preview + (ownedNames.length > 4 ? '…' : '')
              : 'Пока ничего не добавлено'}
          </span>
          <span className="muted small">
            {ownedNames.length} {productsWord(ownedNames.length)} · {ideasCount}{' '}
            {ideasWord(ideasCount)} для еды
          </span>
        </span>
        <span className="chev">›</span>
      </button>

      <button className="btn btn-primary btn-big" onClick={onPick}>
        🍽️ Подобрать еду
      </button>
    </div>
  )
}
