import styles from './SearchInput.module.css'
import { html } from '../../utils/dom'
import { icons } from '../../utils/icons'

interface SearchInputProps {
  onSearch: (query: string) => void
}

export function SearchInput({ onSearch }: SearchInputProps) {
  const el = html(`
    <label class="${styles.root}">
      <input class="${styles.input}" type="search" placeholder="Пошук" aria-label="Пошук уроків" />
      <span class="${styles.icon}">${icons.search}</span>
    </label>
  `)

  el.querySelector('input')!.addEventListener('input', (e) => onSearch((e.target as HTMLInputElement).value))

  return el
}
