import styles from './ThemeToggle.module.css'
import { html } from '../../utils/dom'
import { icons } from '../../utils/icons'
import { readStorage, writeStorage } from '../../utils/storage'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'educationit:theme'
const systemDark = window.matchMedia('(prefers-color-scheme: dark)')

/** Поточна тема: обрана користувачем, а якщо не обрана — як у системі */
function currentTheme(): Theme {
  const saved = readStorage(STORAGE_KEY)
  if (saved === 'light' || saved === 'dark') return saved
  return systemDark.matches ? 'dark' : 'light'
}

export function ThemeToggle() {
  const el = html<HTMLButtonElement>(`<button class="${styles.root}" type="button"></button>`)

  const render = () => {
    const theme = currentTheme()
    const label = theme === 'dark' ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'
    // Показуємо іконку теми, на яку перемкнемось
    el.innerHTML = theme === 'dark' ? icons.sun : icons.moon
    el.setAttribute('aria-label', label)
    el.title = label
  }

  el.addEventListener('click', () => {
    const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    writeStorage(STORAGE_KEY, next)
    render()
  })

  // Якщо тему не обрано вручну, іконка стежить за зміною теми в системі
  systemDark.addEventListener('change', render)
  render()

  return el
}
