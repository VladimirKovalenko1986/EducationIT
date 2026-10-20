import styles from './NextLessonButton.module.css'
import { html } from '../../utils/dom'
import { icons } from '../../utils/icons'

export interface NextLessonButtonProps {
  href: string
  /** Що робить кнопка: «До наступної теми», «До наступного блоку»… */
  label: string
  /** Назва теми, на яку переходимо */
  title: string
}

export function NextLessonButton({ href, label, title }: NextLessonButtonProps) {
  return html(`
    <nav class="${styles.root}" aria-label="Наступна тема">
      <a class="${styles.button}" href="${href}">
        <span class="${styles.text}">
          <span class="${styles.label}">${label}</span>
          <span class="${styles.title}">${title}</span>
        </span>
        <span class="${styles.arrow}">${icons.arrow}</span>
      </a>
    </nav>
  `)
}
