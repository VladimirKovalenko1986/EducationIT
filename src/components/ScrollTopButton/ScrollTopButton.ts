import styles from './ScrollTopButton.module.css'
import { html } from '../../utils/dom'
import { cx } from '../../utils/cx'
import { icons } from '../../utils/icons'

interface ScrollTopButtonProps {
  /** Елемент, що прокручується (контент сторінки) */
  target: HTMLElement
  /** Після скількох пікселів прокрутки показувати кнопку */
  threshold?: number
}

export function ScrollTopButton({ target, threshold = 400 }: ScrollTopButtonProps) {
  const el = html<HTMLButtonElement>(`
    <button class="${styles.root}" type="button" aria-label="Нагору" title="Нагору" tabindex="-1">
      ${icons.arrowUp}
    </button>
  `)

  const update = () => {
    const visible = target.scrollTop > threshold
    el.className = cx(styles.root, visible && styles.visible)
    // Схована кнопка не повинна ловити фокус з клавіатури
    el.tabIndex = visible ? 0 : -1
  }

  target.addEventListener('scroll', update, { passive: true })
  el.addEventListener('click', () => target.scrollTo({ top: 0, behavior: 'smooth' }))
  update()

  return el
}
