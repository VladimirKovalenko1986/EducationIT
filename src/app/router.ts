// Маршрути на hash, щоб сайт працював без налаштування сервера:
//   #/                          — головна (привітання)
//   #/courses                   — список курсів
//   #/courses/<курс>            — перший урок курсу
//   #/courses/<курс>/<урок>     — конкретний урок

export type Route =
  | { page: 'home' }
  | { page: 'courses' }
  | { page: 'course'; courseId: string; lessonId?: string }

export const homeUrl = () => '#/'
export const coursesUrl = () => '#/courses'
export const courseUrl = (courseId: string) => `#/courses/${courseId}`
export const lessonUrl = (courseId: string, lessonId: string) => `#/courses/${courseId}/${lessonId}`

export function parseRoute(hash = location.hash): Route {
  const [section, courseId, lessonId] = hash.replace(/^#\/?/, '').split('/').filter(Boolean)

  if (section !== 'courses') return { page: 'home' }
  if (!courseId) return { page: 'courses' }
  return { page: 'course', courseId, lessonId }
}

export function onRouteChange(listener: (route: Route) => void) {
  const handle = () => listener(parseRoute())
  window.addEventListener('hashchange', handle)
  handle()
}
