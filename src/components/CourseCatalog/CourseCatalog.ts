import './CourseCatalog.css'
import type { Course } from '../../types'
import { html } from '../../utils/dom'
import { CourseCard } from '../CourseCard/CourseCard'

interface CourseCatalogProps {
  courses: Course[]
}

export function CourseCatalog({ courses }: CourseCatalogProps) {
  const el = html(`
    <section class="course-catalog">
      <h1 class="course-catalog__title">Курси</h1>
      <div class="course-catalog__grid"></div>
    </section>
  `)

  el.querySelector('.course-catalog__grid')!.append(...courses.map((course) => CourseCard({ course })))

  return el
}
