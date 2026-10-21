import styles from './App.module.css'
import type { Course } from '../types'
import { html } from '../utils/dom'
import { lessonUrl, moduleUrl, onRouteChange, parseRoute, type Route } from './router'
import { Header } from '../components/Header/Header'
import { Sidebar } from '../components/Sidebar/Sidebar'
import { LessonView } from '../components/LessonView/LessonView'
import { CourseCatalog } from '../components/CourseCatalog/CourseCatalog'
import { Home } from '../components/Home/Home'
import { ScrollTopButton } from '../components/ScrollTopButton/ScrollTopButton'
import { HomeworkPanel } from '../components/HomeworkPanel/HomeworkPanel'
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

function findModule(course: Course, moduleId?: string) {
  for (const block of course.blocks) {
    const module = block.modules.find((m) => m.id === moduleId)
    if (module) return { block, module }
  }
}

/** Куди веде домашнє завдання: на наступний модуль (навіть порожній) або наступний блок */
function findNextModule(course: Course, moduleId: string): NextLessonButtonProps | undefined {
  const all = course.blocks.flatMap((block) => block.modules.map((module) => ({ block, module })))
  const index = all.findIndex((item) => item.module.id === moduleId)
  const current = all[index]
  const next = all[index + 1]
  if (!current || !next) return

  const firstLesson = next.module.lessons[0]
  return {
    href: firstLesson ? lessonUrl(course.id, firstLesson.id) : moduleUrl(course.id, next.module.id),
    label: next.block !== current.block ? 'До наступного блоку' : 'До наступного модуля',
    title: next.module.title,
  }
}

/** Наступний урок курсу (порожні модулі пропускаємо) і підпис для кнопки переходу */
function findNextLesson(course: Course, lessonId: string): NextLessonButtonProps | undefined {
  const all = course.blocks.flatMap((block) =>
    block.modules.flatMap((module) => module.lessons.map((lesson) => ({ block, module, lesson }))),
  )
  const index = all.findIndex((item) => item.lesson.id === lessonId)
  const current = all[index]
  if (!current) return

  // Домашнє завдання завжди веде на наступний модуль
  if (current.lesson.isTask) return findNextModule(course, current.module.id)

  const next = all[index + 1]
  if (!next) return

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

  // Кнопка «нагору» стоїть у правому нижньому куті контенту на всіх сторінках
  el.querySelector(`.${styles.body}`)!.append(ScrollTopButton({ target: contentSlot }))

  const state = {
    page: 'home' as Route['page'],
    course: undefined as Course | undefined,
    blockId: '',
    lessonId: '',
    /** Відкритий за посиланням модуль без уроків (показуємо заглушку) */
    emptyModuleId: '',
    openModules: new Set<string>(),
    /** Модуль, підсвічений у меню: останній натиснутий або той, де відкрита тема */
    selectedModuleId: '',
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
        selectedModuleId: state.selectedModuleId,
        query: state.query,
        onToggleModule: (moduleId) => {
          state.selectedModuleId = moduleId
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
        const found = state.course && state.lessonId ? findLesson(state.course, state.lessonId) : undefined
        const emptyModule = state.course && findModule(state.course, state.emptyModuleId)?.module
        // Модуль без уроків: заголовок модуля і заглушка замість змісту
        if (emptyModule) {
          return LessonView({
            lesson: {
              id: emptyModule.id,
              title: emptyModule.title,
              content: '<p>Матеріали цього модуля з’являться згодом.</p>',
            },
          })
        }
        return LessonView({
          lesson: found?.lesson,
          next: state.course && findNextLesson(state.course, state.lessonId),
          // Для домашнього завдання справа — панель здачі
          aside:
            state.course && found?.lesson.isTask
              ? HomeworkPanel({
                  lesson: found.lesson,
                  context: {
                    course: state.course.title,
                    block: found.block.title,
                    module: found.module.title,
                    lesson: found.lesson.title,
                  },
                })
              : undefined,
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
    // Адреса може вести не на урок, а на порожній модуль (кнопка після домашнього завдання)
    const foundModule = course && route.page === 'course' ? findModule(course, route.lessonId) : undefined
    const prevPage = state.page
    const prevCourse = state.course
    const prevBlockId = state.blockId

    // Неіснуючий курс — повертаємо до списку курсів
    state.page = route.page === 'course' && !course ? 'courses' : route.page
    state.course = course
    state.blockId = found?.block.id ?? foundModule?.block.id ?? course?.blocks[0]?.id ?? ''
    state.lessonId = found?.lesson.id ?? ''
    state.emptyModuleId = foundModule?.module.id ?? ''
    const module = found?.module ?? foundModule?.module
    if (module) {
      state.openModules.add(module.id)
      state.selectedModuleId = module.id
    }

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
