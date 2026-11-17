import styles from './FinalTest.module.css'
import { html } from '../../utils/dom'
import { cx } from '../../utils/cx'
import { icons } from '../../utils/icons'
import { readStorage, writeStorage } from '../../utils/storage'

interface Question {
  question: string
  options: string[]
  /** Індекс правильної відповіді */
  correct: number
}

interface FinalTestProps {
  /** Унікальний id тесту: за ним запам'ятовуються спроби */
  id: string
  questions: Question[]
  /** Скільки разів можна пройти тест */
  attempts?: number
  /** Мінімальний відсоток правильних відповідей для успішного проходження */
  pass?: number
}

interface SavedState {
  /** Скільки спроб уже використано */
  used: number
  /** Результат останньої спроби */
  last?: { correct: number; total: number }
  /** Найкращий результат у відсотках */
  best?: number
}

const percent = (correct: number, total: number) => (total ? Math.round((correct / total) * 100) : 0)

/**
 * Підсумкове тестування: кілька питань з одним правильним варіантом, які показуються по одному.
 * Після останнього питання — результат у відсотках. Кількість спроб обмежена й запам'ятовується.
 * У конспекті записується так:
 * <div data-final-test data-attempts="3" data-pass="80">
 *   <div data-correct="1"><p>Питання</p><ul><li>Варіант 1</li><li>Варіант 2</li></ul></div>
 *   ...
 * </div>
 */
export function FinalTest({ id, questions, attempts = 3, pass = 80 }: FinalTestProps) {
  const storageKey = `educationit:test:${id}`
  const total = questions.length

  const load = (): SavedState => {
    try {
      const raw = readStorage(storageKey)
      const data = raw ? (JSON.parse(raw) as SavedState) : null
      return data && typeof data.used === 'number' ? data : { used: 0 }
    } catch {
      return { used: 0 }
    }
  }
  let state = load()

  const el = html(`<section class="${styles.root}" aria-label="Підсумкове тестування"></section>`)

  let current = 0
  let correctCount = 0
  let selected = -1

  const attemptsLeft = () => Math.max(0, attempts - state.used)

  const renderIntro = () => {
    const left = attemptsLeft()
    const last = state.last
    el.className = styles.root
    el.innerHTML = `
      <div class="${styles.body}">
        <div class="${styles.facts}">
          <span class="${styles.fact}">${icons.target}${total} питань</span>
          <span class="${styles.fact}">${icons.reset}Спроб: ${left} з ${attempts}</span>
          <span class="${styles.fact}">${icons.clock}Час не обмежений</span>
        </div>
        <p class="${styles.lead}">Для кожного питання є лише одна правильна відповідь. Щоб пройти тестування, потрібно відповісти правильно щонайменше на ${pass}% питань.</p>
        ${
          last
            ? `<p class="${styles.lastResult}">Твій останній результат: <b>${percent(last.correct, last.total)}%</b>${
                state.best !== undefined ? ` · найкращий: <b>${state.best}%</b>` : ''
              }</p>`
            : ''
        }
        ${
          left > 0
            ? `<button class="${styles.primary}" type="button" data-action="start">${state.used ? 'Пройти ще раз' : 'Почати тестування'}</button>`
            : `<p class="${styles.noAttempts}">Усі спроби використано.</p>`
        }
      </div>
    `
  }

  const renderQuestion = () => {
    const q = questions[current]
    selected = -1
    el.className = styles.root
    el.innerHTML = `
      <div class="${styles.progress}" aria-hidden="true"><span style="width:${(current / total) * 100}%"></span></div>
      <div class="${styles.body}">
        <p class="${styles.counter}">Питання ${current + 1} з ${total}</p>
        <p class="${styles.question}">${q.question} <span class="${styles.hint}">(1 правильна відповідь)</span></p>
        <div class="${styles.options}" role="radiogroup">
          ${q.options
            .map(
              (option, i) => `
                <button class="${styles.option}" type="button" role="radio" aria-checked="false" data-index="${i}">
                  <span class="${styles.radio}" aria-hidden="true"></span>
                  <span>${option}</span>
                </button>`,
            )
            .join('')}
        </div>
        <button class="${styles.primary}" type="button" data-action="next" disabled>${
          current === total - 1 ? 'Завершити тестування' : 'Далі'
        }</button>
      </div>
    `
  }

  const renderResult = () => {
    const wrong = total - correctCount
    const value = percent(correctCount, total)
    const passed = value >= pass
    const left = attemptsLeft()
    el.className = cx(styles.root, passed ? styles.passed : styles.failed)
    el.innerHTML = `
      <div class="${styles.body} ${styles.result}">
        <span class="${styles.resultIcon}">${passed ? icons.check : icons.close}</span>
        <p class="${styles.resultTitle}">${passed ? 'Вітаємо, ти молодець!' : 'Цього разу не вийшло'}</p>
        <p class="${styles.resultText}">${
          passed
            ? 'Тестування пройдено успішно.'
            : `Тестування не пройдено: потрібно щонайменше ${pass}% правильних відповідей. Повтори матеріал блоку і спробуй ще раз.`
        }</p>
        <p class="${styles.score}">${value}%</p>
        <div class="${styles.stats}">
          <div class="${styles.stat}"><span>Правильно</span><b class="${styles.good}">${correctCount}</b></div>
          <div class="${styles.stat}"><span>Неправильно</span><b class="${styles.bad}">${wrong}</b></div>
        </div>
        <p class="${styles.attemptsInfo}">${left > 0 ? `Залишилось спроб: ${left} з ${attempts}` : 'Усі спроби використано'}</p>
        ${left > 0 ? `<button class="${styles.secondary}" type="button" data-action="start">${icons.reset}Пройти ще раз</button>` : ''}
      </div>
    `
  }

  const finish = () => {
    const value = percent(correctCount, total)
    state = {
      used: state.used + 1,
      last: { correct: correctCount, total },
      best: Math.max(state.best ?? 0, value),
    }
    writeStorage(storageKey, JSON.stringify(state))
    renderResult()
  }

  el.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    const option = target.closest<HTMLButtonElement>(`.${styles.option}`)
    if (option) {
      selected = Number(option.dataset.index)
      el.querySelectorAll<HTMLButtonElement>(`.${styles.option}`).forEach((b) =>
        b.setAttribute('aria-checked', String(b === option)),
      )
      el.querySelector<HTMLButtonElement>('[data-action="next"]')!.disabled = false
      return
    }

    const action = target.closest<HTMLButtonElement>('[data-action]')?.dataset.action
    if (action === 'start' && attemptsLeft() > 0) {
      current = 0
      correctCount = 0
      renderQuestion()
      el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    } else if (action === 'next' && selected >= 0) {
      if (selected === questions[current].correct) correctCount++
      current++
      if (current < total) renderQuestion()
      else finish()
    }
  })

  renderIntro()
  return el
}

/** Замінює розмітку підсумкових тестів у змісті уроку на інтерактивні компоненти */
export function mountFinalTests(root: HTMLElement, lessonId: string) {
  root.querySelectorAll<HTMLElement>('[data-final-test]').forEach((node, index) => {
    const questions = [...node.querySelectorAll<HTMLElement>(':scope > [data-correct]')].map((q) => ({
      question: q.querySelector('p')?.innerHTML ?? '',
      options: [...q.querySelectorAll('li')].map((li) => li.innerHTML),
      correct: Number(q.dataset.correct ?? 0),
    }))
    node.replaceWith(
      FinalTest({
        id: `${lessonId}:${index}`,
        questions,
        attempts: Number(node.dataset.attempts ?? 3),
        pass: Number(node.dataset.pass ?? 80),
      }),
    )
  })
}
