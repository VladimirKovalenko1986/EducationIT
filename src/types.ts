export interface Lesson {
  id: string
  title: string
  /** HTML-розмітка уроку */
  content: string
  /** Домашнє завдання: виділяється в меню і має форму здачі */
  isTask?: boolean
  /** Дедлайн домашнього завдання у форматі 'YYYY-MM-DD'; без нього — «Дедлайн відсутній» */
  deadline?: string
}

export interface Module {
  id: string
  title: string
  lessons: Lesson[]
}

export interface Block {
  id: string
  title: string
  modules: Module[]
}

export interface Course {
  id: string
  title: string
  description: string
  blocks: Block[]
}
