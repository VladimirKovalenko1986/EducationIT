import styles from './CourseCard.module.css'
import type { Course } from '../../types'
import { html } from '../../utils/dom'
import { icons } from '../../utils/icons'
import { courseUrl } from '../../app/router'

interface CourseCardProps {
  course: Course
}

export function CourseCard({ course }: CourseCardProps) {
  return html(`
    <a class="${styles.root}" href="${courseUrl(course.id)}">
      <h2 class="${styles.title}">${course.title}</h2>
      <p class="${styles.text}">${course.description}</p>
      <span class="${styles.open}">Відкрити ${icons.arrow}</span>
    </a>
  `)
}
