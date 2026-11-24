import React, { useState } from 'react'
import { ENERGY_LEVELS, ONBOARDING_IDS, productById } from '../data.js'

const STEPS = 3

export default function Onboarding({ energy, setEnergy, owned, toggleProduct, onFinish }) {
  const [step, setStep] = useState(0)
  const last = step === STEPS - 1

  return (
    <div className="onboarding">
      <div className="onb-top">
        <div className="dots" aria-hidden="true">
          {Array.from({ length: STEPS }).map((_, i) => (
            <span key={i} className={`dot ${i === step ? 'on' : ''}`} />
          ))}
        </div>
        <button className="link" onClick={onFinish}>
          Пропустить
        </button>
      </div>

      <div className="onb-body" key={step}>
        {step === 0 && (
          <>
            <div className="onb-art">🐈☕</div>
            <h1>Привет! Это «Маленькая кухня» 🍲</h1>
            <p className="onb-text">
              Тебе не нужно готовить идеальную еду. Давай найдём что-нибудь, что
              ты сможешь съесть прямо сейчас — из того, что уже есть дома.
            </p>
            <p className="muted">
              Без калорий, строгих меню и чувства вины.
            </p>
          </>
        )}

        {step === 1 && (
          <>
            <div className="onb-art">🛏️ ☕ 🌞</div>
            <h1>Сколько у тебя сил?</h1>
            <p className="onb-text">
              Выбери, как ты себя чувствуешь сейчас. Это можно менять в любой момент.
            </p>
            <div className="energy-stack">
              {ENERGY_LEVELS.map((l) => (
                <button
                  key={l.id}
                  className={`energy-wide ${energy === l.id ? 'active' : ''}`}
                  onClick={() => setEnergy(l.id)}
                  aria-pressed={energy === l.id}
                >
                  <span className="energy-emoji">{l.emoji}</span>
                  <span className="energy-wide-text">
                    <strong>{l.label}</strong>
                    <span className="muted">{l.hint}</span>
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="onb-art">🧺</div>
            <h1>Что есть дома?</h1>
            <p className="onb-text">
              Отметь то, что видишь прямо сейчас. Остальное добавишь потом.
            </p>
            <div className="chips onb-chips">
              {ONBOARDING_IDS.map((id) => {
                const p = productById[id]
                const has = owned.includes(id)
                return (
                  <button
                    key={id}
                    className={`chip ${has ? 'chip-on' : ''}`}
                    onClick={() => toggleProduct(id)}
                    aria-pressed={has}
                  >
                    <span>{p.emoji}</span>
                    <span>{p.name}</span>
                    {has && <span className="chip-mark">✓</span>}
                  </button>
                )
              })}
            </div>
            <p className="muted small">
              Соль, масло и вода считаются, что есть всегда.
            </p>
          </>
        )}
      </div>

      <div className="onb-bottom">
        <button
          className="btn btn-primary btn-big"
          onClick={() => (last ? onFinish() : setStep(step + 1))}
        >
          {last ? 'Начать' : 'Дальше'}
        </button>
        {step > 0 && (
          <button className="link" onClick={() => setStep(step - 1)}>
            Назад
          </button>
        )}
      </div>
    </div>
  )
}
