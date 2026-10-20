import './BlockSelect.css'
import type { Block } from '../../types'
import { html } from '../../utils/dom'
import { icons } from '../../utils/icons'

interface BlockSelectProps {
  blocks: Block[]
  value: string
  onChange: (blockId: string) => void
}

export function BlockSelect({ blocks, value, onChange }: BlockSelectProps) {
  const el = html(`
    <label class="block-select">
      <select aria-label="Блок курсу">
        ${blocks
          .map((block) => `<option value="${block.id}" ${block.id === value ? 'selected' : ''}>${block.title}</option>`)
          .join('')}
      </select>
      ${icons.chevron}
    </label>
  `)

  el.querySelector('select')!.addEventListener('change', (e) => onChange((e.target as HTMLSelectElement).value))

  return el
}
