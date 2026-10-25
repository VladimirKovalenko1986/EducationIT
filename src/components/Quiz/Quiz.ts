import styles from './Quiz.module.css'
import { html } from '../../utils/dom'
import { cx } from '../../utils/cx'
import { icons } from '../../utils/icons'

interface QuizProps {
  question: string
  options: string[]
  /** Індекс правильної відповіді */
  correct: number
  /** Текст після правильної відповіді */
  success?: string
}

/**
 * Квіз з одним правильним варіантом. У конспекті записується так:
 * <div data-quiz data-correct="0" data-success="Гарний старт!">
 *   <p>Питання</p>
 *   <ul><li>Варіант 1</li><li>Варіант 2</li></ul>
 * </div>
 */
export function Quiz({ question, options, correct, success = 'Правильно!' }: QuizProps) {
  const el = html(`
    <section class="${styles.root}" aria-label="Квіз">
      <span class="${styles.badge}">Квіз</span>
      <p class="${styles.question}">${question}</p>
      <div class="${styles.options}" role="group">
        ${options
          .map((option, i) => `<button class="${styles.option}" type="button" data-index="${i}">${option}</button>`)
          .join('')}
      </div>
      <p class="${styles.result}" role="status"></p>
    </section>
  `)

  const result = el.querySelector<HTMLElement>(`.${styles.result}`)!
  const buttons = [...el.querySelectorAll<HTMLButtonElement>(`.${styles.option}`)]

  el.addEventListener('click', (e) => {
    const button = (e.target as HTMLElement).closest<HTMLButtonElement>(`.${styles.option}`)
    if (!button || button.disabled) return

    const isCorrect = Number(button.dataset.index) === correct
    button.classList.add(isCorrect ? styles.correct : styles.wrong)

    if (isCorrect) {
      // Після правильної відповіді квіз завершено
      for (const b of buttons) b.disabled = true
      result.innerHTML = `${icons.check}<span>${success}</span>`
      result.className = cx(styles.result, styles.success)
    } else {
      button.disabled = true
      result.textContent = 'Не зовсім. Спробуй ще раз!'
      result.className = cx(styles.result, styles.error)
    }
  })

  return el
}

/** Замінює розмітку квізів у змісті уроку на інтерактивні компоненти */
export function mountQuizzes(root: HTMLElement) {
  for (const node of root.querySelectorAll<HTMLElement>('[data-quiz]')) {
    node.replaceWith(
      Quiz({
        question: node.querySelector('p')?.innerHTML ?? '',
        options: [...node.querySelectorAll('li')].map((li) => li.innerHTML),
        correct: Number(node.dataset.correct ?? 0),
        success: node.dataset.success,
      }),
    )
  }
}
