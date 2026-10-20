import './CourseCard.css'
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
    <a class="course-card" href="${courseUrl(course.id)}">
      <span class="course-card__badge">Блоків: ${course.blocks.length} · Модулів: ${modulesCount}</span>
      <h2 class="course-card__title">${course.title}</h2>
      <p class="course-card__text">${course.description}</p>
      <span class="course-card__open">Відкрити ${icons.arrow}</span>
    </a>
  `)
}
