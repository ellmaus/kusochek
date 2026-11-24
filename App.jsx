import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { PRODUCTS } from './data.js'
import { matchRecipes, useLocalStorage } from './store.js'
import { TabBar } from './components.jsx'
import Home from './screens/Home.jsx'
import Products from './screens/Products.jsx'
import Results from './screens/Results.jsx'
import Recipe from './screens/Recipe.jsx'
import Favorites from './screens/Favorites.jsx'
import Settings from './screens/Settings.jsx'

const DEFAULT_OWNED = ['eggs', 'bread', 'cheese', 'tomato']
const DEFAULT_SETTINGS = { noStove: false, veg: false }

// Диплинки из бота: /?tab=products|favorites|settings или /?screen=results
function readStartParams() {
  try {
    const p = new URLSearchParams(window.location.search)
    const tab = ['home', 'products', 'favorites', 'settings'].includes(p.get('tab'))
      ? p.get('tab')
      : 'home'
    const stack = p.get('screen') === 'results' ? [{ name: 'results' }] : []
    return { tab, stack }
  } catch {
    return { tab: 'home', stack: [] }
  }
}
const START = readStartParams()

export default function App() {
  // Всё это сохраняется в localStorage
  const [energy, setEnergy] = useLocalStorage('mk:energy', 1)
  const [owned, setOwned] = useLocalStorage('mk:owned', DEFAULT_OWNED)
  const [customProducts, setCustomProducts] = useLocalStorage('mk:custom', [])
  const [favorites, setFavorites] = useLocalStorage('mk:favorites', [])
  const [settings, setSettings] = useLocalStorage('mk:settings', DEFAULT_SETTINGS)

  // Простая навигация: вкладка + стек экранов поверх неё
  const [tab, setTab] = useState(START.tab)
  const [stack, setStack] = useState(START.stack) //[{ name: 'results' | 'recipe' | 'products', id? }]
  const current = stack[stack.length - 1]

  const push = useCallback((screen) => setStack((s) => [...s, screen]), [])
  const back = useCallback(() => setStack((s) => s.slice(0, -1)), [])
  const goTab = (t) => {
    setStack([])
    setTab(t)
  }

  const toggleProduct = (id) =>
    setOwned((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]))

  const addCustom = (name) => {
    const clean = name.trim()
    if (!clean) return
    const existing = [...PRODUCTS, ...customProducts].find(
      (p) => p.name.toLowerCase() === clean.toLowerCase(),
    )
    if (existing) {
      setOwned((l) => (l.includes(existing.id) ? l : [...l, existing.id]))
      return
    }
    const id = 'custom-' + Date.now()
    setCustomProducts((l) => [...l, { id, name: clean, emoji: '🍽️', custom: true }])
    setOwned((l) => [...l, id])
  }

  const removeCustom = (id) => {
    setCustomProducts((l) => l.filter((p) => p.id !== id))
    setOwned((l) => l.filter((x) => x !== id))
  }

  const toggleFav = (id) =>
    setFavorites((l) => (l.includes(id) ? l.filter((x) => x !== id) : [...l, id]))

  const resetAll = () => {
    setEnergy(1)
    setOwned([])
    setCustomProducts([])
    setFavorites([])
    setSettings(DEFAULT_SETTINGS)
  }

  // Названия продуктов для карточки на главной
  const ownedNames = useMemo(() => {
    const all = [...PRODUCTS, ...customProducts]
    return owned.map((id) => all.find((p) => p.id === id)?.name.toLowerCase()).filter(Boolean)
  }, [owned, customProducts])

  const ideasCount = useMemo(
    () =>
      matchRecipes({
        energy,
        owned,
        filters: { noStove: !!settings.noStove, veg: !!settings.veg },
      }).length,
    [energy, owned, settings],
  )

  // Кнопка «Назад» Telegram (если приложение открыто внутри Telegram)
  useEffect(() => {
    const bb = window.Telegram?.WebApp?.BackButton
    if (!bb) return
    const handler = () => back()
    if (stack.length > 0) {
      bb.show()
      bb.onClick(handler)
    } else {
      bb.hide()
    }
    return () => bb.offClick?.(handler)
  }, [stack.length, back])

  // Прокрутка вверх при смене экрана
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [tab, current?.name, current?.id])

  let content
  if (current?.name === 'results') {
    content = (
      <Results
        energy={energy}
        owned={owned}
        settings={settings}
        favorites={favorites}
        toggleFav={toggleFav}
        onOpen={(id) => push({ name: 'recipe', id })}
        onBack={back}
        onProducts={() => push({ name: 'products' })}
      />
    )
  } else if (current?.name === 'recipe') {
    content = (
      <Recipe
        id={current.id}
        owned={owned}
        favorites={favorites}
        toggleFav={toggleFav}
        onBack={back}
      />
    )
  } else if (current?.name === 'products' || tab === 'products') {
    content = (
      <Products
        owned={owned}
        customProducts={customProducts}
        toggleProduct={toggleProduct}
        addCustom={addCustom}
        removeCustom={removeCustom}
        onBack={current ? back : undefined}
      />
    )
  } else if (tab === 'favorites') {
    content = (
      <Favorites
        favorites={favorites}
        toggleFav={toggleFav}
        onOpen={(id) => push({ name: 'recipe', id })}
        onPick={() => push({ name: 'results' })}
      />
    )
  } else if (tab === 'settings') {
    content = (
      <Settings
        energy={energy}
        setEnergy={setEnergy}
        settings={settings}
        setSettings={setSettings}
        onReset={resetAll}
      />
    )
  } else {
    content = (
      <Home
        energy={energy}
        setEnergy={setEnergy}
        ownedNames={ownedNames}
        ideasCount={ideasCount}
        onPick={() => push({ name: 'results' })}
        onProducts={() => goTab('products')}
      />
    )
  }

  return (
    <div className="app">
      <main className="content">{content}</main>
      <TabBar
        active={current?.name === 'products' ? 'products' : tab}
        onChange={goTab}
      />
    </div>
  )
}
