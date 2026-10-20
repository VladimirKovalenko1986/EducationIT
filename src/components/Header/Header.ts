import styles from './Header.module.css'
import type { Course } from '../../types'
import { html } from '../../utils/dom'
import { icons } from '../../utils/icons'
import { Breadcrumbs } from '../Breadcrumbs/Breadcrumbs'
import { BlockSelect } from '../BlockSelect/BlockSelect'
import { SearchInput } from '../SearchInput/SearchInput'

interface HeaderProps {
  /** Відкритий курс; без нього шапка показує лише «Курси» */
  course?: Course
  blockId: string
  onBlockChange: (blockId: string) => void
  onSearch: (query: string) => void
  onMenuToggle: () => void
}

export function Header({ course, blockId, onBlockChange, onSearch, onMenuToggle }: HeaderProps) {
  const el = html(`<header class="${styles.root}"></header>`)

  if (course) {
    const menuButton = html(`<button class="${styles.menu}" type="button" aria-label="Меню модулів">${icons.menu}</button>`)
    menuButton.addEventListener('click', onMenuToggle)
    el.append(menuButton)
  }

  el.append(
    Breadcrumbs({
      course,
      slot: course ? BlockSelect({ blocks: course.blocks, value: blockId, onChange: onBlockChange }) : undefined,
    }),
  )

  if (course) el.append(SearchInput({ onSearch }))

  return el
}
