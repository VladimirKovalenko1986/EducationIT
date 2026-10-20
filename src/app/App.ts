import styles from './App.module.css'
import type { Course } from '../types'
import { html } from '../utils/dom'
import { lessonUrl, onRouteChange, parseRoute, type Route } from './router'
import { Header } from '../components/Header/Header'
import { Sidebar } from '../components/Sidebar/Sidebar'
import { LessonView } from '../components/LessonView/LessonView'
import { CourseCatalog } from '../components/CourseCatalog/CourseCatalog'
import { Home } from '../components/Home/Home'
import type { NextLessonButtonProps } from '../components/NextLessonButton/NextLessonButton'

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

/** Наступний урок курсу (порожні модулі пропускаємо) і підпис для кнопки переходу */
function findNextLesson(course: Course, lessonId: string): NextLessonButtonProps | undefined {
  const all = course.blocks.flatMap((block) =>
    block.modules.flatMap((module) => module.lessons.map((lesson) => ({ block, module, lesson }))),
  )
  const index = all.findIndex((item) => item.lesson.id === lessonId)
  const current = all[index]
  const next = all[index + 1]
  if (!current || !next) return

  const label =
    next.block !== current.block
      ? 'До наступного блоку'
      : next.module !== current.module
        ? 'До наступного модуля'
        : next.lesson.isTask
          ? 'До домашнього завдання'
          : 'До наступної теми'

  return { href: lessonUrl(course.id, next.lesson.id), label, title: next.lesson.title }
}

export function App({ courses }: AppProps) {
  const el = html(`
    <div class="${styles.root}">
      <div class="${styles.header}"></div>
      <div class="${styles.body}">
        <aside class="${styles.sidebar}"></aside>
        <div class="${styles.overlay}"></div>
        <main class="${styles.content}"></main>
      </div>
    </div>
  `)

  const headerSlot = el.querySelector<HTMLElement>(`.${styles.header}`)!
  const sidebarSlot = el.querySelector<HTMLElement>(`.${styles.sidebar}`)!
  const contentSlot = el.querySelector<HTMLElement>(`.${styles.content}`)!

  const state = {
    page: 'home' as Route['page'],
    course: undefined as Course | undefined,
    blockId: '',
    lessonId: '',
    openModules: new Set<string>(),
    query: '',
  }

  const setMenuOpen = (open: boolean) => el.classList.toggle(styles.menuOpen, open)
  el.querySelector(`.${styles.overlay}`)!.addEventListener('click', () => setMenuOpen(false))

  function renderHeader() {
    headerSlot.replaceChildren(
      Header({
        page: state.page,
        course: state.course,
        blockId: state.blockId,
        onBlockChange: (blockId) => {
          const block = state.course?.blocks.find((b) => b.id === blockId)
          const firstLesson = block?.modules[0]?.lessons[0]
          if (firstLesson) {
            const url = lessonUrl(state.course!.id, firstLesson.id)
            // Та сама адреса не викликає hashchange, тому оновлюємо сторінку вручну
            if (location.hash === url) handleRoute(parseRoute())
            else location.hash = url
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
        onMenuToggle: () => setMenuOpen(!el.classList.contains(styles.menuOpen)),
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
    const pages = {
      home: () => Home(),
      courses: () => CourseCatalog({ courses }),
      course: () => {
        const block = state.course?.blocks.find((b) => b.id === state.blockId)
        return LessonView({
          lesson: state.course && state.lessonId ? findLesson(state.course, state.lessonId)?.lesson : undefined,
          next: state.course && findNextLesson(state.course, state.lessonId),
          emptyText: block?.modules.length ? undefined : 'Матеріали цього блоку з’являться згодом',
        })
      },
    }
    contentSlot.replaceChildren(pages[state.page]())
    contentSlot.scrollTop = 0
  }

  function handleRoute(route: Route) {
    const course = route.page === 'course' ? courses.find((c) => c.id === route.courseId) : undefined
    const found = course && findLesson(course, route.page === 'course' ? route.lessonId : undefined)
    const prevPage = state.page
    const prevCourse = state.course
    const prevBlockId = state.blockId

    // Неіснуючий курс — повертаємо до списку курсів
    state.page = route.page === 'course' && !course ? 'courses' : route.page
    state.course = course
    state.blockId = found?.block.id ?? course?.blocks[0]?.id ?? ''
    state.lessonId = found?.lesson.id ?? ''
    if (found) state.openModules.add(found.module.id)

    el.classList.toggle(styles.noSidebar, !course)
    setMenuOpen(false)

    // Шапку перемальовуємо лише при зміні сторінки, курсу чи блоку, щоб не скидати пошук
    if (prevPage !== state.page || prevCourse !== course || prevBlockId !== state.blockId || !headerSlot.firstChild) {
      state.query = ''
      renderHeader()
    }
    renderSidebar()
    renderContent()
  }

  onRouteChange(handleRoute)

  return el
}
