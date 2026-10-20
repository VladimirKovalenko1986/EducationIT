import styles from './LessonView.module.css'
import type { Lesson } from '../../types'
import { html } from '../../utils/dom'
import { NextLessonButton, type NextLessonButtonProps } from '../NextLessonButton/NextLessonButton'

interface LessonViewProps {
  lesson?: Lesson
  /** Куди веде кнопка внизу уроку; без неї кнопки немає */
  next?: NextLessonButtonProps
  /** Текст, коли уроку немає */
  emptyText?: string
}

export function LessonView({ lesson, next, emptyText = 'Оберіть тему в меню' }: LessonViewProps) {
  if (!lesson) return html(`<p class="${styles.empty}">${emptyText}</p>`)

  const el = html(`
    <article class="${styles.root}">
      <h1 class="${styles.title}">${lesson.title}</h1>
      <div class="${styles.body}">${lesson.content}</div>
    </article>
  `)

  if (next) el.append(NextLessonButton(next))

  return el
}
