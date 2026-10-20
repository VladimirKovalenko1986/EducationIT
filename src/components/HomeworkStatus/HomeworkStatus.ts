import styles from './HomeworkStatus.module.css'
import { html } from '../../utils/dom'
import { cx } from '../../utils/cx'

interface HomeworkStatusProps {
  submitted: boolean
  /** 'YYYY-MM-DD' */
  deadline?: string
}

function deadlineText(deadline?: string) {
  if (!deadline) return { text: 'Дедлайн відсутній', overdue: false }

  // Дедлайн діє до кінця вказаного дня
  const date = new Date(`${deadline}T23:59:59`)
  const formatted = date.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })
  const overdue = date.getTime() < Date.now()
  return { text: overdue ? `Дедлайн минув ${formatted}` : `Дедлайн: ${formatted}`, overdue }
}

export function HomeworkStatus({ submitted, deadline }: HomeworkStatusProps) {
  const due = deadlineText(deadline)

  return html(`
    <ul class="${styles.root}">
      <li class="${cx(styles.row, submitted && styles.done)}">
        <span class="${styles.icon}" aria-hidden="true">${submitted ? '✅' : '⏰'}</span>
        ${submitted ? 'Надіслано на перевірку' : 'Завдання очікує виконання'}
      </li>
      <li class="${cx(styles.row, due.overdue && !submitted && styles.overdue)}">
        <span class="${styles.icon}" aria-hidden="true">🔥</span>
        ${due.text}
      </li>
    </ul>
  `)
}
