import type { Course, Module } from '../types'
import b1m1t1 from './lessons/cybersecurity/b1-m1-t1.html?raw'
import b1m1t2 from './lessons/cybersecurity/b1-m1-t2.html?raw'
import b1m1hw from './lessons/cybersecurity/b1-m1-hw.html?raw'
import b1m2t1 from './lessons/cybersecurity/b1-m2-t1.html?raw'
import b1m2t2 from './lessons/cybersecurity/b1-m2-t2.html?raw'
import b1m2hw from './lessons/cybersecurity/b1-m2-hw.html?raw'
import b1m3t1 from './lessons/cybersecurity/b1-m3-t1.html?raw'
import b1m3t2 from './lessons/cybersecurity/b1-m3-t2.html?raw'
import b1m3hw from './lessons/cybersecurity/b1-m3-hw.html?raw'

// Модулі без уроків: поки лише назви, зміст додамо пізніше
// prefix розділяє id різних курсів (від нього залежать адреси та збережений статус ДЗ)
const emptyModule = (n: number, title: string, prefix = 'b1'): Module => ({
  id: `${prefix}-m${n}`,
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
          {
            id: 'b1-m2',
            title: 'Модуль 2. Операційний центр безпеки (SOC)',
            lessons: [
              { id: 'b1-m2-t1', title: 'Тема 1. Що таке SOC', content: b1m2t1 },
              { id: 'b1-m2-t2', title: 'Тема 2. Ролі та відповідальності', content: b1m2t2 },
              { id: 'b1-m2-hw', title: 'Домашнє завдання', isTask: true, content: b1m2hw },
            ],
          },
          {
            id: 'b1-m3',
            title: 'Модуль 3. Адміністрування систем кібербезпеки',
            lessons: [
              { id: 'b1-m3-t1', title: 'Тема 1. Основи Windows', content: b1m3t1 },
              { id: 'b1-m3-t2', title: 'Тема 2. Основи Linux', content: b1m3t2 },
              { id: 'b1-m3-hw', title: 'Домашнє завдання', isTask: true, content: b1m3hw },
            ],
          },
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
  {
    id: 'fullstack',
    title: 'Full-stack developers',
    description: 'Розробка вебзастосунків від інтерфейсу до сервера: HTML, CSS, JavaScript та бекенд.',
    blocks: [
      {
        id: 'block-1',
        title: 'HTML+CSS 2.1',
        modules: [
          emptyModule(1, 'Основи HTML', 'fs-b1'),
          emptyModule(2, 'Вступ до CSS', 'fs-b1'),
          emptyModule(3, 'Блокова модель. Flexbox', 'fs-b1'),
          emptyModule(4, 'Декоративні ефекти', 'fs-b1'),
          emptyModule(5, 'Елементи форм. Доступність', 'fs-b1'),
          emptyModule(6, 'Адаптивний дизайн', 'fs-b1'),
        ],
      },
    ],
  },
]
