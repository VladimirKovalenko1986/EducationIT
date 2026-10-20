export interface Lesson {
  id: string
  title: string
  /** HTML-розмітка уроку */
  content: string
  /** Виділяє пункт у меню (наприклад, домашнє завдання) */
  isTask?: boolean
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
