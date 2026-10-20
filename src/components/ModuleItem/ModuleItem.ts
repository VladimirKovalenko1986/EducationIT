import './ModuleItem.css'
import type { Lesson, Module } from '../../types'
import { html } from '../../utils/dom'
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

  const el = html(`
    <section class="module-item ${isOpen ? 'is-open' : ''} ${hasActive ? 'has-active' : ''}">
      <button class="module-item__toggle" type="button" aria-expanded="${isOpen}">
        <span>${module.title}</span>
        ${icons.chevron}
      </button>
      ${
        isOpen
          ? `<ul class="module-item__lessons">
              ${lessons
                .map(
                  (lesson) => `
                    <li>
                      <a href="${lessonUrl(courseId, lesson.id)}"
                         class="module-item__lesson ${lesson.id === activeLessonId ? 'is-active' : ''} ${lesson.isTask ? 'is-task' : ''}"
                         ${lesson.id === activeLessonId ? 'aria-current="page"' : ''}>${lesson.title}</a>
                    </li>`,
                )
                .join('')}
            </ul>`
          : ''
      }
    </section>
  `)

  el.querySelector('.module-item__toggle')!.addEventListener('click', onToggle)

  return el
}
