import styles from './CourseCatalog.module.css'
import type { Course } from '../../types'
import { html } from '../../utils/dom'
import { CourseCard } from '../CourseCard/CourseCard'

interface CourseCatalogProps {
  courses: Course[]
}

export function CourseCatalog({ courses }: CourseCatalogProps) {
  const grid = html(`<div class="${styles.grid}"></div>`)
  grid.append(...courses.map((course) => CourseCard({ course })))

  const el = html(`
    <section class="${styles.root}">
      <h1 class="${styles.title}">Курси</h1>
    </section>
  `)
  el.append(grid)

  return el
}
