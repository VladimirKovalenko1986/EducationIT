import type { Course } from '../types'

// Сюди додаємо курси. Структура: курс → блоки → модулі → уроки.
export const courses: Course[] = [
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    description: 'Основи кібербезпеки, управління ризиками та захист інформації.',
    blocks: [
      {
        id: 'block-1',
        title: 'Блок 1',
        modules: [
          {
            id: 'module-1',
            title: 'Модуль 1',
            lessons: [
              {
                id: 'lesson-1-1',
                title: 'Урок 1.1',
                content: '<p>Тут буде зміст уроку.</p>',
              },
            ],
          },
        ],
      },
    ],
  },
]
