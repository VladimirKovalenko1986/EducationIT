import styles from './Quiz.module.css'
import { html } from '../../utils/dom'
import { cx } from '../../utils/cx'
import { icons } from '../../utils/icons'
import { readStorage, writeStorage } from '../../utils/storage'

interface QuizProps {
  /** Унікальний id квізу: за ним запам'ятовується відповідь */
  id: string
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
 * Квіз з одним правильним варіантом. Відповідь надсилається кнопкою один раз і запам'ятовується.
 * У конспекті записується так:
 * <div data-quiz data-correct="0" data-success="Молодець!">
 *   <p>Питання</p>
 *   <ul><li>Варіант 1</li><li>Варіант 2</li></ul>
 * </div>
 */
export function Quiz({
  id,
  question,
  options,
  correct,
  success = 'Молодець!',
  error = 'Неправильно. Пройди ще раз матеріал і перечитай уважніше.',
}: QuizProps) {
  const storageKey = `educationit:quiz:${id}`

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
        <button class="${styles.submit}" type="button" disabled>Відправити відповідь</button>
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
  const submit = el.querySelector<HTMLButtonElement>(`.${styles.submit}`)!
  const buttons = [...el.querySelectorAll<HTMLButtonElement>(`.${styles.option}`)]
  let selected = -1

  const select = (index: number) => {
    selected = index
    for (const b of buttons) b.setAttribute('aria-checked', String(Number(b.dataset.index) === index))
    submit.disabled = false
  }

  // Показ результату; після відповіді квіз закривається назавжди
  const showResult = (index: number) => {
    select(index)
    const isCorrect = index === correct
    buttons[index].classList.add(isCorrect ? styles.correct : styles.wrong)
    for (const b of buttons) b.disabled = true
    submit.remove()

    el.classList.add(styles.answered, isCorrect ? styles.solved : styles.failed)
    resultTitle.innerHTML = `<span class="${styles.resultIcon}">${isCorrect ? icons.check : icons.close}</span>Результат`
    resultText.textContent = isCorrect ? success : error
    result.className = cx(styles.result, isCorrect ? styles.success : styles.error)
    result.hidden = false
  }

  el.addEventListener('click', (e) => {
    const button = (e.target as HTMLElement).closest<HTMLButtonElement>(`.${styles.option}`)
    if (button && !button.disabled) select(Number(button.dataset.index))
  })

  submit.addEventListener('click', () => {
    if (selected < 0) return
    writeStorage(storageKey, String(selected))
    showResult(selected)
  })

  // Якщо на квіз уже відповідали — одразу показуємо збережений результат
  const saved = readStorage(storageKey)
  if (saved !== null && buttons[Number(saved)]) showResult(Number(saved))

  return el
}

/** Замінює розмітку квізів у змісті уроку на інтерактивні компоненти */
export function mountQuizzes(root: HTMLElement, lessonId: string) {
  root.querySelectorAll<HTMLElement>('[data-quiz]').forEach((node, index) => {
    node.replaceWith(
      Quiz({
        id: `${lessonId}:${index}`,
        question: node.querySelector('p')?.innerHTML ?? '',
        options: [...node.querySelectorAll('li')].map((li) => li.innerHTML),
        correct: Number(node.dataset.correct ?? 0),
        success: node.dataset.success,
        error: node.dataset.error,
      }),
    )
  })
}
