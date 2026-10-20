import './SearchInput.css'
import { html } from '../../utils/dom'
import { icons } from '../../utils/icons'

interface SearchInputProps {
  onSearch: (query: string) => void
}

export function SearchInput({ onSearch }: SearchInputProps) {
  const el = html(`
    <label class="search-input">
      <input type="search" placeholder="Пошук" aria-label="Пошук уроків" />
      ${icons.search}
    </label>
  `)

  el.querySelector('input')!.addEventListener('input', (e) => onSearch((e.target as HTMLInputElement).value))

  return el
}
