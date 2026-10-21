import styles from './Sidebar.module.css'
import type { Block } from '../../types'
import { html } from '../../utils/dom'
import { cx } from '../../utils/cx'
import { icons } from '../../utils/icons'
import { ModuleItem } from '../ModuleItem/ModuleItem'
import { SidebarRail } from '../SidebarRail/SidebarRail'

interface SidebarProps {
  courseId: string
  block?: Block
  activeLessonId: string
  openModules: Set<string>
  selectedModuleId: string
  query: string
  /** Згорнуте меню (лише на ноутбуці й десктопі; на телефоні й планшеті меню завжди повне) */
  collapsed: boolean
  onToggleModule: (moduleId: string) => void
  onToggleCollapsed: () => void
}

export function Sidebar({
  courseId,
  block,
  activeLessonId,
  openModules,
  selectedModuleId,
  query,
  collapsed,
  onToggleModule,
  onToggleCollapsed,
}: SidebarProps) {
  const label = collapsed ? 'Розгорнути меню' : 'Згорнути меню'
  const el = html(`
    <nav class="${cx(styles.root, collapsed && styles.collapsed)}" aria-label="Модулі курсу">
      <button class="${styles.toggle}" type="button" title="${label}" aria-label="${label}" aria-expanded="${!collapsed}">
        ${collapsed ? icons.expand : `${icons.collapse}<span>Згорнути</span>`}
      </button>
      <div class="${styles.full}"></div>
    </nav>
  `)
  el.querySelector('button')!.addEventListener('click', onToggleCollapsed)

  if (collapsed) {
    const rail = html(`<div class="${styles.rail}"></div>`)
    rail.append(SidebarRail({ courseId, block, activeLessonId, selectedModuleId }))
    el.append(rail)
  }

  const full = el.querySelector<HTMLElement>(`.${styles.full}`)!
  const search = query.trim().toLowerCase()

  const modules = (block?.modules ?? [])
    .map((module) => ({
      module,
      lessons: search ? module.lessons.filter((l) => l.title.toLowerCase().includes(search)) : module.lessons,
    }))
    .filter(({ module, lessons }) => !search || lessons.length > 0 || module.title.toLowerCase().includes(search))

  if (modules.length === 0) {
    full.append(html(`<p class="${styles.empty}">${search ? 'Нічого не знайдено' : 'Тут поки немає модулів'}</p>`))
    return el
  }

  for (const { module, lessons } of modules) {
    full.append(
      ModuleItem({
        courseId,
        module,
        lessons,
        // Під час пошуку модулі з результатами завжди розгорнуті
        isOpen: search ? true : openModules.has(module.id),
        isSelected: module.id === selectedModuleId,
        activeLessonId,
        onToggle: () => onToggleModule(module.id),
      }),
    )
  }

  return el
}
