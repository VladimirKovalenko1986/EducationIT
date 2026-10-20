// Маршрути на hash, щоб сайт працював без налаштування сервера:
//   #/                   — список курсів
//   #/<курс>             — перший урок курсу
//   #/<курс>/<урок>      — конкретний урок

export interface Route {
  courseId?: string
  lessonId?: string
}

export const coursesUrl = () => '#/'
export const courseUrl = (courseId: string) => `#/${courseId}`
export const lessonUrl = (courseId: string, lessonId: string) => `#/${courseId}/${lessonId}`

export function parseRoute(hash = location.hash): Route {
  const [courseId, lessonId] = hash.replace(/^#\/?/, '').split('/').filter(Boolean)
  return { courseId, lessonId }
}

export function onRouteChange(listener: (route: Route) => void) {
  const handle = () => listener(parseRoute())
  window.addEventListener('hashchange', handle)
  handle()
}
