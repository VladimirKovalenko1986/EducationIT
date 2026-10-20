import styles from './LessonView.module.css'
import type { Lesson } from '../../types'
import { html } from '../../utils/dom'

interface LessonViewProps {
  lesson?: Lesson
  /** Текст, коли уроку немає */
  emptyText?: string
}

export function LessonView({ lesson, emptyText = 'Оберіть тему в меню' }: LessonViewProps) {
  if (!lesson) return html(`<p class="${styles.empty}">${emptyText}</p>`)

  return html(`
    <article class="${styles.root}">
      <h1 class="${styles.title}">${lesson.title}</h1>
      <div class="${styles.body}">${lesson.content}</div>
    </article>
  `)
}
