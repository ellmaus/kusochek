import { useEffect, useState } from 'react'
import { RECIPES, FILTER_TESTS } from './data.js'

// Состояние, которое сохраняется в localStorage (переживает перезагрузку)
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw !== null ? JSON.parse(raw) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* localStorage может быть недоступен — не страшно */
    }
  }, [key, value])

  return [value, setValue]
}

// Подбор рецептов по энергии, продуктам и фильтрам.
// Рецепт с недостающими ингредиентами не исключается — показываем, чего не хватает.
export function matchRecipes({ energy, owned, filters }) {
  const have = new Set(owned)
  const active = Object.keys(filters).filter((k) => filters[k] && FILTER_TESTS[k])
  const result = []

  for (const recipe of RECIPES) {
    if (recipe.energy > energy) continue
    if (!active.every((k) => FILTER_TESTS[k](recipe))) continue

    const missing = recipe.ingredients.filter((i) => !have.has(i))
    const matched = recipe.ingredients.length - missing.length
    const score = matched / recipe.ingredients.length

    // Нужно, чтобы хотя бы часть продуктов была дома
    if (matched === 0) continue
    if (recipe.ingredients.length === 1 && missing.length) continue
    if (score < 0.5) continue

    result.push({ recipe, missing, score })
  }

  // Сначала те, где есть все продукты, затем — самые быстрые
  result.sort((a, b) => b.score - a.score || a.recipe.time - b.recipe.time)
  return result
}
