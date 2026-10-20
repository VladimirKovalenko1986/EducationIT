import './App.css'
import type { Course } from '../types'
import { html } from '../utils/dom'
import { lessonUrl, onRouteChange, type Route } from './router'
import { Header } from '../components/Header/Header'
import { Sidebar } from '../components/Sidebar/Sidebar'
import { LessonView } from '../components/LessonView/LessonView'
import { CourseCatalog } from '../components/CourseCatalog/CourseCatalog'

interface AppProps {
  courses: Course[]
}

function findLesson(course: Course, lessonId?: string) {
  for (const block of course.blocks) {
    for (const module of block.modules) {
      const lesson = lessonId ? module.lessons.find((l) => l.id === lessonId) : module.lessons[0]
      if (lesson) return { block, module, lesson }
    }
  }
}

export function App({ courses }: AppProps) {
  const el = html(`
    <div class="app">
      <div class="app__header"></div>
      <div class="app__body">
        <aside class="app__sidebar"></aside>
        <div class="app__overlay"></div>
        <main class="app__content"></main>
      </div>
    </div>
  `)

  const headerSlot = el.querySelector<HTMLElement>('.app__header')!
  const sidebarSlot = el.querySelector<HTMLElement>('.app__sidebar')!
  const contentSlot = el.querySelector<HTMLElement>('.app__content')!

  const state = {
    course: undefined as Course | undefined,
    blockId: '',
    lessonId: '',
    openModules: new Set<string>(),
    query: '',
  }

  const setMenuOpen = (open: boolean) => el.classList.toggle('is-menu-open', open)
  el.querySelector('.app__overlay')!.addEventListener('click', () => setMenuOpen(false))

  function renderHeader() {
    headerSlot.replaceChildren(
      Header({
        course: state.course,
        blockId: state.blockId,
        onBlockChange: (blockId) => {
          const block = state.course?.blocks.find((b) => b.id === blockId)
          const firstLesson = block?.modules[0]?.lessons[0]
          if (firstLesson) {
            location.hash = lessonUrl(state.course!.id, firstLesson.id)
          } else {
            // Порожній блок: показуємо його без уроку
            state.blockId = blockId
            state.lessonId = ''
            renderSidebar()
            renderContent()
          }
        },
        onSearch: (query) => {
          state.query = query
          renderSidebar()
        },
        onMenuToggle: () => setMenuOpen(!el.classList.contains('is-menu-open')),
      }),
    )
  }

  function renderSidebar() {
    if (!state.course) return sidebarSlot.replaceChildren()

    sidebarSlot.replaceChildren(
      Sidebar({
        courseId: state.course.id,
        block: state.course.blocks.find((b) => b.id === state.blockId),
        activeLessonId: state.lessonId,
        openModules: state.openModules,
        query: state.query,
        onToggleModule: (moduleId) => {
          if (state.openModules.has(moduleId)) state.openModules.delete(moduleId)
          else state.openModules.add(moduleId)
          renderSidebar()
        },
      }),
    )
  }

  function renderContent() {
    const lesson = state.course && findLesson(state.course, state.lessonId)?.lesson
    contentSlot.replaceChildren(state.course ? LessonView({ lesson }) : CourseCatalog({ courses }))
    contentSlot.scrollTop = 0
  }

  function handleRoute({ courseId, lessonId }: Route) {
    const course = courses.find((c) => c.id === courseId)
    const found = course && findLesson(course, lessonId)
    const prevCourse = state.course
    const prevBlockId = state.blockId

    state.course = course
    state.blockId = found?.block.id ?? course?.blocks[0]?.id ?? ''
    state.lessonId = found?.lesson.id ?? ''
    if (found) state.openModules.add(found.module.id)

    el.classList.toggle('is-catalog', !course)
    setMenuOpen(false)

    // Шапку перемальовуємо лише при зміні курсу чи блоку, щоб не скидати пошук
    if (prevCourse !== course || prevBlockId !== state.blockId || !headerSlot.firstChild) {
      state.query = ''
      renderHeader()
    }
    renderSidebar()
    renderContent()
  }

  onRouteChange(handleRoute)

  return el
}
