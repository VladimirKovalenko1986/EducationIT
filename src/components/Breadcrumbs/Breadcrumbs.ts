import './Breadcrumbs.css'
import type { Course } from '../../types'
import { html } from '../../utils/dom'
import { icons } from '../../utils/icons'
import { coursesUrl } from '../../app/router'

interface BreadcrumbsProps {
  course?: Course
  /** Останній елемент ланцюжка (наприклад, вибір блоку) */
  slot?: HTMLElement
}

export function Breadcrumbs({ course, slot }: BreadcrumbsProps) {
  const sep = `<span class="breadcrumbs__sep">${icons.arrow}</span>`

  const el = html(`
    <nav class="breadcrumbs" aria-label="Навігація">
      <a href="${coursesUrl()}" class="breadcrumbs__item breadcrumbs__home" aria-label="Головна">${icons.home}</a>
      ${sep}
      <a href="${coursesUrl()}" class="breadcrumbs__item breadcrumbs__link breadcrumbs__courses">Курси</a>
      ${course ? `${sep}<span class="breadcrumbs__item breadcrumbs__current">${course.title}</span>` : ''}
      ${slot ? sep : ''}
    </nav>
  `)

  if (slot) el.append(slot)

  return el
}
