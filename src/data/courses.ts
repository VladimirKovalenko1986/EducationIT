import type { Course, Module } from '../types'
import b1m1t1 from './lessons/cybersecurity/b1-m1-t1.html?raw'
import b1m1t2 from './lessons/cybersecurity/b1-m1-t2.html?raw'
import b1m1hw from './lessons/cybersecurity/b1-m1-hw.html?raw'

// Модулі без уроків: поки лише назви, зміст додамо пізніше
const emptyModule = (n: number, title: string): Module => ({
  id: `b1-m${n}`,
  title: `Модуль ${n}. ${title}`,
  lessons: [],
})

// Сюди додаємо курси. Структура: курс → блоки → модулі → уроки.
export const courses: Course[] = [
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    description: 'Основи кібербезпеки, управління ризиками та захист інформації.',
    blocks: [
      {
        id: 'block-1',
        title: 'Блок 1. Оборонна кібербезпека',
        modules: [
          {
            id: 'b1-m1',
            title: 'Модуль 1. Вступ до оборонної кібербезпеки',
            lessons: [
              { id: 'b1-m1-t1', title: 'Тема 1. Принципи кібербезпеки', content: b1m1t1 },
              { id: 'b1-m1-t2', title: 'Тема 2. Ситуаційна обізнаність', content: b1m1t2 },
              {
                id: 'b1-m1-hw',
                title: 'Домашнє завдання',
                isTask: true,
                deadline: '2026-10-31',
                content: b1m1hw,
              },
            ],
          },
          emptyModule(2, 'Операційний центр безпеки (SOC)'),
          emptyModule(3, 'Адміністрування систем кібербезпеки'),
          emptyModule(4, 'Безпечне адміністрування мережі'),
          emptyModule(5, 'Архітектура кібербезпеки'),
          emptyModule(6, 'Реагування на інциденти (IR)'),
          emptyModule(7, 'Криптографія'),
          emptyModule(8, 'Обмін інформацією та збагачення систем кібербезпеки'),
          emptyModule(9, 'Кібербезпека в хмарній інфраструктурі'),
          emptyModule(10, 'Фінальна практика блоку'),
        ],
      },
      { id: 'block-2', title: 'Блок 2', modules: [] },
      { id: 'block-3', title: 'Блок 3', modules: [] },
    ],
  },
]
