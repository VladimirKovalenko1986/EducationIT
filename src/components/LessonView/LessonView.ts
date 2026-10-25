import styles from './LessonView.module.css'
import type { Lesson } from '../../types'
import { html } from '../../utils/dom'
import { NextLessonButton, type NextLessonButtonProps } from '../NextLessonButton/NextLessonButton'
import { ImageLightbox } from '../ImageLightbox/ImageLightbox'
import { mountQuizzes } from '../Quiz/Quiz'

interface LessonViewProps {
  lesson?: Lesson
  /** Куди веде кнопка внизу уроку; без неї кнопки немає */
  next?: NextLessonButtonProps
  /** Бічна панель (наприклад, здача домашнього завдання) */
  aside?: HTMLElement
  /** Текст, коли уроку немає */
  emptyText?: string
}

export function LessonView({ lesson, next, aside, emptyText = 'Оберіть тему в меню' }: LessonViewProps) {
  if (!lesson) return html(`<p class="${styles.empty}">${emptyText}</p>`)

  const article = html(`
    <article class="${styles.root}">
      <h1 class="${styles.title}">${lesson.title}</h1>
      <div class="${styles.body}">${lesson.content}</div>
    </article>
  `)

  const body = article.querySelector<HTMLElement>(`.${styles.body}`)!

  // Картинка, якої ще немає на сервері, не повинна лишати «битий» значок — ховаємо її разом з підписом
  body.addEventListener(
    'error',
    (e) => {
      const target = e.target as HTMLElement
      if (target instanceof HTMLImageElement) (target.closest('figure') ?? target).remove()
    },
    true,
  )

  mountQuizzes(body)
  article.append(ImageLightbox({ target: body }))
  if (next) article.append(NextLessonButton(next))
  if (!aside) return article

  // Урок з бічною панеллю: на широкому контенті — дві колонки, на вузькому — панель під текстом
  const layout = html(`
    <div class="${styles.withAside}">
      <div class="${styles.grid}">
        <div class="${styles.main}"></div>
        <div class="${styles.aside}"></div>
      </div>
    </div>
  `)
  layout.querySelector(`.${styles.main}`)!.append(article)
  layout.querySelector(`.${styles.aside}`)!.append(aside)

  return layout
}
