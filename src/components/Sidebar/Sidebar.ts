import styles from './Sidebar.module.css'
import type { Block } from '../../types'
import { html } from '../../utils/dom'
import { ModuleItem } from '../ModuleItem/ModuleItem'

interface SidebarProps {
  courseId: string
  block?: Block
  activeLessonId: string
  openModules: Set<string>
  selectedModuleId: string
  query: string
  onToggleModule: (moduleId: string) => void
}

export function Sidebar({
  courseId,
  block,
  activeLessonId,
  openModules,
  selectedModuleId,
  query,
  onToggleModule,
}: SidebarProps) {
  const el = html(`<nav class="${styles.root}" aria-label="Модулі курсу"></nav>`)
  const search = query.trim().toLowerCase()

  const modules = (block?.modules ?? [])
    .map((module) => ({
      module,
      lessons: search ? module.lessons.filter((l) => l.title.toLowerCase().includes(search)) : module.lessons,
    }))
    .filter(({ module, lessons }) => !search || lessons.length > 0 || module.title.toLowerCase().includes(search))

  if (modules.length === 0) {
    el.append(html(`<p class="${styles.empty}">${search ? 'Нічого не знайдено' : 'Тут поки немає модулів'}</p>`))
    return el
  }

  for (const { module, lessons } of modules) {
    el.append(
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
