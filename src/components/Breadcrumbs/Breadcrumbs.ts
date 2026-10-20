import styles from './Breadcrumbs.module.css'
import type { Course } from '../../types'
import { html } from '../../utils/dom'
import { cx } from '../../utils/cx'
import { icons } from '../../utils/icons'
import { coursesUrl } from '../../app/router'

interface BreadcrumbsProps {
  course?: Course
  /** Останній елемент ланцюжка (наприклад, вибір блоку) */
  slot?: HTMLElement
}

export function Breadcrumbs({ course, slot }: BreadcrumbsProps) {
  const sep = (...extra: string[]) => `<span class="${cx(styles.sep, ...extra)}">${icons.arrow}</span>`

  const el = html(`
    <nav class="${cx(styles.root, course && styles.inCourse)}" aria-label="Навігація">
      <a href="${coursesUrl()}" class="${cx(styles.item, styles.home)}" aria-label="Головна">${icons.home}</a>
      ${sep(styles.secondary)}
      <a href="${coursesUrl()}" class="${cx(styles.item, styles.link, styles.secondary)}">Курси</a>
      ${
        course
          ? `${sep(styles.secondary, styles.courseSep)}
             <span class="${cx(styles.item, styles.current, styles.secondary)}">${course.title}</span>`
          : ''
      }
      ${slot ? sep() : ''}
    </nav>
  `)

  if (slot) el.append(slot)

  return el
}
