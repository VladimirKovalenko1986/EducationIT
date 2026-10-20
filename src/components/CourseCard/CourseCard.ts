import styles from './CourseCard.module.css'
import type { Course } from '../../types'
import { html } from '../../utils/dom'
import { icons } from '../../utils/icons'
import { courseUrl } from '../../app/router'

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  const modulesCount = course.blocks.reduce((sum, block) => sum + block.modules.length, 0)

  return html(`
    <a class="${styles.root}" href="${courseUrl(course.id)}">
      <span class="${styles.badge}">Блоків: ${course.blocks.length} · Модулів: ${modulesCount}</span>
      <h2 class="${styles.title}">${course.title}</h2>
      <p class="${styles.text}">${course.description}</p>
      <span class="${styles.open}">Відкрити ${icons.arrow}</span>
    </a>
  `)
}
