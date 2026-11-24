import React from 'react'
import { productById, recipeById, recipeTags } from '../data.js'
import { Dish, Header, actionsWord } from '../components.jsx'

export default function Recipe({ id, owned, favorites, toggleFav, onBack }) {
  const recipe = recipeById[id]
  if (!recipe) {
    return (
      <div className="screen">
        <Header title="Рецепт" onBack={onBack} />
        <p className="muted">Рецепт не найден.</p>
      </div>
    )
  }

  const fav = favorites.includes(recipe.id)
  const missing = recipe.ingredients.filter((i) => !owned.includes(i))

  return (
    <div className="screen recipe-screen">
      <Header
        title=""
        onBack={onBack}
        right={
          <button
            className={`icon-btn heart ${fav ? 'on' : ''}`}
            onClick={() => toggleFav(recipe.id)}
            aria-label={fav ? 'Убрать из избранного' : 'В избранное'}
          >
            {fav ? '♥' : '♡'}
          </button>
        }
      />

      <div className="recipe-hero">
        <Dish emoji={recipe.emoji} size="xl" />
      </div>

      <h1 className="recipe-title">{recipe.title}</h1>
      <p className="meta">
        <span>🕒 {recipe.timeLabel}</span>
        <span>
          🥄 {recipe.actions} {actionsWord(recipe.actions)}
        </span>
      </p>
      {recipeTags(recipe).length > 0 && (
        <div className="chips">
          {recipeTags(recipe).map((t) => (
            <span key={t} className="tag">
              {t}
            </span>
          ))}
        </div>
      )}

      <section className="section">
        <h2>Ингредиенты</h2>
        <div className="chips">
          {recipe.ingredients.map((i) => {
            const p = productById[i]
            const has = owned.includes(i)
            return (
              <span key={i} className={`chip ${has ? 'chip-on' : 'chip-miss'}`}>
                <span>{p.emoji}</span>
                <span>{p.name}</span>
                <span className="chip-mark">{has ? '✓' : ''}</span>
              </span>
            )
          })}
        </div>
        {recipe.optional.length > 0 && (
          <p className="muted">
            Можно добавить:{' '}
            {recipe.optional.map((i) => productById[i].name.toLowerCase()).join(', ')}
          </p>
        )}
        {missing.length > 0 && (
          <div className="notice">
            <strong>Не хватает:</strong>{' '}
            {missing.map((i) => productById[i].name.toLowerCase()).join(', ')}
            {recipe.subs &&
              missing
                .filter((i) => recipe.subs[i])
                .map((i) => (
                  <div key={i} className="small">
                    💡 {recipe.subs[i]}
                  </div>
                ))}
          </div>
        )}
      </section>

      <section className="section">
        <h2>Как приготовить</h2>
        <ol className="steps">
          {recipe.steps.map((s, idx) => (
            <li key={idx}>
              <span className="step-num">{idx + 1}</span>
              <span>{s}</span>
            </li>
          ))}
          <li>
            <span className="step-num">✓</span>
            <span>Готово!</span>
          </li>
        </ol>
      </section>

      {recipe.tip && (
        <div className="tip">
          <span className="tip-icon">💡</span>
          <div>
            <strong>Совет</strong>
            <div className="small">{recipe.tip}</div>
          </div>
        </div>
      )}

      <button
        className={`btn ${fav ? 'btn-soft' : 'btn-primary'} btn-big`}
        onClick={() => toggleFav(recipe.id)}
      >
        {fav ? '♥ В избранном' : 'В избранное'}
      </button>
    </div>
  )
}
