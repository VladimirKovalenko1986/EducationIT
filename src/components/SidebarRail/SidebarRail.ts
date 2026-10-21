import styles from './SidebarRail.module.css'
import type { Block } from '../../types'
import { html } from '../../utils/dom'
import { cx } from '../../utils/cx'
import { icons } from '../../utils/icons'
import { lessonUrl, moduleUrl } from '../../app/router'

interface SidebarRailProps {
  courseId: string
  block?: Block
  activeLessonId: string
  selectedModuleId: string
}

/** Згорнуте меню: лише номери модулів, а під вибраним модулем — номери його тем */
export function SidebarRail({ courseId, block, activeLessonId, selectedModuleId }: SidebarRailProps) {
  const el = html(`<ol class="${styles.root}"></ol>`)

  block?.modules.forEach((module, index) => {
    const isSelected = module.id === selectedModuleId
    const firstLesson = module.lessons[0]
    const href = firstLesson ? lessonUrl(courseId, firstLesson.id) : moduleUrl(courseId, module.id)

    // Номер теми: «1», «2»… а для домашнього завдання — іконка ноутбука
    let topicNumber = 0
    const lessons = isSelected
      ? module.lessons
          .map((lesson) => {
            const label = lesson.isTask ? icons.laptop : String(++topicNumber)
            const isActive = lesson.id === activeLessonId
            return `
              <li>
                <a class="${cx(styles.lesson, isActive && styles.lessonActive)}"
                   href="${lessonUrl(courseId, lesson.id)}" title="${lesson.title}"
                   aria-label="${lesson.title}" ${isActive ? 'aria-current="page"' : ''}>${label}</a>
              </li>`
          })
          .join('')
      : ''

    el.append(
      html(`
        <li class="${styles.item}">
          <a class="${cx(styles.module, isSelected && styles.moduleSelected)}"
             href="${href}" title="${module.title}" aria-label="${module.title}">${index + 1}</a>
          ${lessons ? `<ul class="${styles.lessons}">${lessons}</ul>` : ''}
        </li>
      `),
    )
  })

  return el
}
