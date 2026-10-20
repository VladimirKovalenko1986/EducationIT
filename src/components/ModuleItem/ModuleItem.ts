import styles from './ModuleItem.module.css'
import type { Lesson, Module } from '../../types'
import { html } from '../../utils/dom'
import { cx } from '../../utils/cx'
import { icons } from '../../utils/icons'
import { lessonUrl } from '../../app/router'

interface ModuleItemProps {
  courseId: string
  module: Module
  /** Уроки, які показуємо (під час пошуку — лише знайдені) */
  lessons: Lesson[]
  isOpen: boolean
  activeLessonId: string
  onToggle: () => void
}

export function ModuleItem({ courseId, module, lessons, isOpen, activeLessonId, onToggle }: ModuleItemProps) {
  const hasActive = module.lessons.some((lesson) => lesson.id === activeLessonId)

  const lessonLink = (lesson: Lesson) => {
    const isActive = lesson.id === activeLessonId
    return `
      <li>
        <a href="${lessonUrl(courseId, lesson.id)}"
           class="${cx(styles.lesson, isActive && styles.lessonActive, lesson.isTask && styles.lessonTask)}"
           ${isActive ? 'aria-current="page"' : ''}>
          ${lesson.isTask ? `<span class="${styles.taskIcon}">${icons.laptop}</span>` : ''}
          <span>${lesson.title}</span>
        </a>
      </li>`
  }

  const list = lessons.length
    ? `<ul class="${styles.lessons}">${lessons.map(lessonLink).join('')}</ul>`
    : `<p class="${styles.empty}">Матеріали з’являться згодом</p>`

  const el = html(`
    <section class="${cx(styles.root, isOpen && styles.open, hasActive && styles.current)}">
      <button class="${styles.toggle}" type="button" aria-expanded="${isOpen}">
        <span>${module.title}</span>
        <span class="${styles.chevron}">${icons.chevron}</span>
      </button>
      ${isOpen ? list : ''}
    </section>
  `)

  el.querySelector('button')!.addEventListener('click', onToggle)

  return el
}
