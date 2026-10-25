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
  /** Текст після неправильної відповіді */
  error?: string
}

/**
 * Квіз з одним правильним варіантом. У конспекті записується так:
 * <div data-quiz data-correct="0" data-success="Молодець!" data-error="Пройди матеріал ще раз">
 *   <p>Питання</p>
 *   <ul><li>Варіант 1</li><li>Варіант 2</li></ul>
 * </div>
 */
export function Quiz({
  question,
  options,
  correct,
  success = 'Молодець!',
  error = 'Неправильно. Пройди ще раз матеріал вище і спробуй знову!',
}: QuizProps) {
  const el = html(`
    <section class="${styles.root}" aria-label="Квіз">
      <div class="${styles.body}">
        <p class="${styles.question}">${question} <span class="${styles.hint}">(1 правильна відповідь)</span></p>
        <div class="${styles.options}" role="radiogroup">
          ${options
            .map(
              (option, i) => `
                <button class="${styles.option}" type="button" role="radio" aria-checked="false" data-index="${i}">
                  <span class="${styles.radio}" aria-hidden="true"></span>
                  <span>${option}</span>
                </button>`,
            )
            .join('')}
        </div>
      </div>
      <div class="${styles.result}" role="status" hidden>
        <p class="${styles.resultTitle}"></p>
        <p class="${styles.resultText}"></p>
      </div>
    </section>
  `)

  const result = el.querySelector<HTMLElement>(`.${styles.result}`)!
  const resultTitle = el.querySelector<HTMLElement>(`.${styles.resultTitle}`)!
  const resultText = el.querySelector<HTMLElement>(`.${styles.resultText}`)!
  const buttons = [...el.querySelectorAll<HTMLButtonElement>(`.${styles.option}`)]

  el.addEventListener('click', (e) => {
    const button = (e.target as HTMLElement).closest<HTMLButtonElement>(`.${styles.option}`)
    if (!button || el.classList.contains(styles.solved)) return

    const isCorrect = Number(button.dataset.index) === correct

    // Позначаємо лише обраний варіант; після помилки можна обрати інший
    for (const b of buttons) {
      b.classList.remove(styles.correct, styles.wrong)
      b.setAttribute('aria-checked', String(b === button))
    }
    button.classList.add(isCorrect ? styles.correct : styles.wrong)

    el.classList.toggle(styles.solved, isCorrect)
    el.classList.toggle(styles.failed, !isCorrect)
    resultTitle.innerHTML = `<span class="${styles.resultIcon}">${isCorrect ? icons.check : icons.close}</span>Результат`
    resultText.textContent = isCorrect ? success : error
    result.className = cx(styles.result, isCorrect ? styles.success : styles.error)
    result.hidden = false
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
        error: node.dataset.error,
      }),
    )
  }
}
