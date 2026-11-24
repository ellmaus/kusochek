import React, { useState } from 'react'
import { ENERGY_LEVELS } from '../data.js'
import { Header } from '../components.jsx'

function Toggle({ label, checked, onChange }) {
  return (
    <button
      className="toggle-row"
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
    >
      <span>{label}</span>
      <span className={`switch ${checked ? 'on' : ''}`}>
        <span className="knob" />
      </span>
    </button>
  )
}

export default function Settings({ energy, setEnergy, settings, setSettings, onReset, onShowIntro }) {
  const [confirm, setConfirm] = useState(false)
  const set = (key) => (value) => setSettings((s) => ({ ...s, [key]: value }))

  return (
    <div className="screen">
      <Header title="Настройки" />

      <section className="section">
        <h2>Питание и предпочтения</h2>
        <p className="muted">Уровень энергии по умолчанию</p>
        <div className="segmented">
          {ENERGY_LEVELS.map((l) => (
            <button
              key={l.id}
              className={energy === l.id ? 'active' : ''}
              onClick={() => setEnergy(l.id)}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="card list-card">
          <Toggle
            label="Не использовать плиту"
            checked={!!settings.noStove}
            onChange={set('noStove')}
          />
          <Toggle
            label="Вегетарианское меню"
            checked={!!settings.veg}
            onChange={set('veg')}
          />
        </div>
      </section>

      <section className="section">
        <h2>Данные</h2>
        <button className="btn btn-soft" onClick={onShowIntro}>
          Показать знакомство снова
        </button>
        <p className="muted">
          Всё хранится только на этом устройстве, в браузере.
        </p>
        {confirm ? (
          <div className="card">
            <p>Стереть продукты, избранное и настройки?</p>
            <div className="row">
              <button
                className="btn btn-danger"
                onClick={() => {
                  onReset()
                  setConfirm(false)
                }}
              >
                Да, стереть
              </button>
              <button className="btn btn-soft" onClick={() => setConfirm(false)}>
                Отмена
              </button>
            </div>
          </div>
        ) : (
          <button className="btn btn-soft" onClick={() => setConfirm(true)}>
            Сбросить данные
          </button>
        )}
      </section>

      <div className="thanks">Спасибо, что ты здесь! Приятного аппетита ❤️</div>
    </div>
  )
}
