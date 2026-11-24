import React from 'react'
import { recipeById } from '../data.js'
import { Header, RecipeCard } from '../components.jsx'

export default function Favorites({ favorites, toggleFav, onOpen, onPick }) {
  const recipes = favorites.map((id) => recipeById[id]).filter(Boolean)

  return (
    <div className="screen">
      <Header title="Избранное" />
      {recipes.length === 0 ? (
        <div className="card empty">
          <div className="empty-emoji">💚</div>
          <h3>Здесь пока пусто</h3>
          <p className="muted">
            Нажми на сердечко у рецепта, который захочется сохранить.
          </p>
          <button className="btn btn-primary" onClick={onPick}>
            Подобрать еду
          </button>
        </div>
      ) : (
        <div className="list">
          {recipes.map((r) => (
            <RecipeCard
              key={r.id}
              recipe={r}
              favorite
              onToggleFav={() => toggleFav(r.id)}
              onOpen={() => onOpen(r.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
