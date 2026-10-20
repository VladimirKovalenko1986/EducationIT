import './LessonView.css'
import type { Lesson } from '../../types'
import { html } from '../../utils/dom'

interface LessonViewProps {
  lesson?: Lesson
}

export function LessonView({ lesson }: LessonViewProps) {
  if (!lesson) return html(`<p class="lesson-view__empty">Обери урок у меню</p>`)

  return html(`
    <article class="lesson-view">
      <h1>${lesson.title}</h1>
      ${lesson.content}
    </article>
  `)
}
