import styles from './Home.module.css'
import { html } from '../../utils/dom'
import { icons } from '../../utils/icons'
import { coursesUrl } from '../../app/router'

const features = [
  { icon: icons.clock, title: 'У власному темпі', text: 'Навчайтесь тоді, коли зручно саме вам.' },
  { icon: icons.target, title: 'Практика після теорії', text: 'Кожен модуль закріплюємо реальними завданнями.' },
  { icon: icons.device, title: 'З будь-якого пристрою', text: 'Телефон, планшет чи ноутбук — уроки завжди під рукою.' },
]

export function Home() {
  return html(`
    <section class="${styles.root}">
      <div class="${styles.hero}">
        <span class="${styles.eyebrow}">EducationIT</span>
        <h1 class="${styles.title}">Ласкаво просимо! <span class="${styles.accent}">Ваш шлях в IT починається тут.</span></h1>
        <p class="${styles.lead}">
          Кожен урок — це крок до нової професії. Ми зібрали знання, практику та досвід,
          щоб ви впевнено рухалися до своєї мети. Ми віримо: у вас усе вийде —
          головне почати й не зупинятися.
        </p>

        <div class="${styles.hint}">
          <p class="${styles.hintText}">
            Щоб обрати курс, натисніть <b>«Курси»</b> у верхньому меню —
            там зібрані всі курси, потрібні для вашого подальшого навчання.
          </p>
          <a class="${styles.button}" href="${coursesUrl()}">Перейти до курсів ${icons.arrow}</a>
        </div>
      </div>

      <ul class="${styles.features}">
        ${features
          .map(
            (f) => `
              <li class="${styles.feature}">
                <span class="${styles.featureIcon}">${f.icon}</span>
                <h2 class="${styles.featureTitle}">${f.title}</h2>
                <p class="${styles.featureText}">${f.text}</p>
              </li>`,
          )
          .join('')}
      </ul>
    </section>
  `)
}
