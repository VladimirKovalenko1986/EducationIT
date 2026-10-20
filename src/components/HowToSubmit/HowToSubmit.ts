import styles from './HowToSubmit.module.css'
import { html } from '../../utils/dom'
import { icons } from '../../utils/icons'

// Мініатюра панелі здачі: поле з посиланням виділене
const illustration = `
  <svg class="${styles.illustration}" viewBox="0 0 240 130" aria-hidden="true">
    <rect x="1" y="1" width="238" height="128" rx="12" fill="#f3f6fa" stroke="#dbe3ec" stroke-width="2"/>
    <rect x="14" y="14" width="130" height="70" rx="6" fill="#ffffff"/>
    <rect x="14" y="92" width="130" height="24" rx="6" fill="#ffffff"/>
    <rect x="154" y="10" width="76" height="110" rx="8" fill="#0b1a2e" stroke="#0d9488" stroke-width="3"/>
    <rect x="166" y="22" width="52" height="6" rx="3" fill="#5eead4"/>
    <rect x="166" y="34" width="40" height="4" rx="2" fill="#7f93ad"/>
    <rect x="162" y="48" width="60" height="26" rx="5" fill="#ffffff"/>
    <text x="192" y="65" text-anchor="middle" font-family="Manrope, Arial, sans-serif" font-size="11" font-weight="800" fill="#0d9488">https://</text>
    <rect x="162" y="84" width="60" height="16" rx="5" fill="#0d9488"/>
  </svg>
`

export function HowToSubmit() {
  const el = html(`
    <div class="${styles.root}">
      <button class="${styles.trigger}" type="button">
        <span aria-hidden="true">❓</span> Як здати домашнє завдання
      </button>

      <dialog class="${styles.dialog}" aria-labelledby="how-to-submit-title">
        <button class="${styles.close}" type="button" aria-label="Закрити">${icons.close}</button>
        ${illustration}
        <h2 class="${styles.title}" id="how-to-submit-title">Як здати домашнє завдання</h2>
        <ol class="${styles.steps}">
          <li>Виконай завдання в <b>Google Docs</b>.</li>
          <li>Відкрий доступ: <b>Поділитися → Усі, хто має посилання</b>.</li>
          <li>Скопіюй посилання і встав його в поле <b>«Здай домашнє завдання!»</b>.</li>
          <li>Натисни <b>«Відправити домашнє завдання»</b> — і все 🎉</li>
        </ol>
      </dialog>
    </div>
  `)

  const dialog = el.querySelector('dialog')!
  el.querySelector(`.${styles.trigger}`)!.addEventListener('click', () => dialog.showModal())
  el.querySelector(`.${styles.close}`)!.addEventListener('click', () => dialog.close())
  // Клік по затемненню навколо віконця теж закриває його
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close()
  })

  return el
}
