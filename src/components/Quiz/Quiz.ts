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
  /** Індекси правильних відповідей; якщо їх кілька — студент обирає кілька варіантів */
  correct: number[]
  /** Текст після правильної відповіді */
  success?: string
  /** Текст після неправильної відповіді */
  error?: string
}

/**
 * Квіз з одним або кількома правильними варіантами. Відповідь надсилається кнопкою один раз і запам'ятовується.
 * У конспекті записується так (кілька правильних — через кому: data-correct="0,2"):
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
  const multiple = correct.length > 1
  const hint = multiple ? `${correct.length} правильні відповіді` : '1 правильна відповідь'
  const role = multiple ? 'checkbox' : 'radio'

  const el = html(`
    <section class="${styles.root}" aria-label="Квіз">
      <div class="${styles.body}">
        <p class="${styles.question}">${question} <span class="${styles.hint}">(${hint})</span></p>
        <div class="${styles.options}" ${multiple ? 'role="group"' : 'role="radiogroup"'}>
          ${options
            .map(
              (option, i) => `
                <button class="${styles.option}" type="button" role="${role}" aria-checked="false" data-index="${i}">
                  <span class="${cx(styles.radio, multiple && styles.checkbox)}" aria-hidden="true"></span>
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
  let selected: number[] = []

  const select = (indexes: number[]) => {
    selected = indexes
    for (const b of buttons) b.setAttribute('aria-checked', String(selected.includes(Number(b.dataset.index))))
    submit.disabled = selected.length === 0
  }

  const toggle = (index: number) => {
    if (!multiple) return select([index])
    select(selected.includes(index) ? selected.filter((i) => i !== index) : [...selected, index])
  }

  // Показ результату; після відповіді квіз закривається назавжди
  const showResult = (indexes: number[]) => {
    select(indexes)
    const isCorrect = indexes.length === correct.length && indexes.every((i) => correct.includes(i))
    for (const i of indexes) buttons[i].classList.add(correct.includes(i) ? styles.correct : styles.wrong)
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
    if (button && !button.disabled) toggle(Number(button.dataset.index))
  })

  submit.addEventListener('click', () => {
    if (!selected.length) return
    writeStorage(storageKey, selected.join(','))
    showResult(selected)
  })

  // Якщо на квіз уже відповідали — одразу показуємо збережений результат
  const saved = readStorage(storageKey)
  const savedIndexes = saved ? saved.split(',').map(Number) : []
  if (savedIndexes.length && savedIndexes.every((i) => buttons[i])) showResult(savedIndexes)

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
        correct: (node.dataset.correct ?? '0').split(',').map((n) => Number(n.trim())),
        success: node.dataset.success,
        error: node.dataset.error,
      }),
    )
  })
}
