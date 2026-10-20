import styles from './HomeworkForm.module.css'
import { html } from '../../utils/dom'
import { cx } from '../../utils/cx'
import { icons } from '../../utils/icons'
import { readStorage, writeStorage } from '../../utils/storage'
import { HomeworkNotConfiguredError, sendHomework, type HomeworkSubmission } from '../../services/homework'

interface HomeworkFormProps {
  /** Курс, блок, модуль і назва завдання — потрапляють у лист */
  context: Omit<HomeworkSubmission, 'studentName' | 'answer' | 'pageUrl'>
  onSubmitted: () => void
}

const NAME_KEY = 'educationit:student-name'

export function HomeworkForm({ context, onSubmitted }: HomeworkFormProps) {
  const el = html<HTMLFormElement>(`
    <form class="${styles.root}" novalidate>
      <div class="${styles.banner}" aria-hidden="true">${icons.laptop}${icons.send}</div>
      <div class="${styles.inner}">
        <h2 class="${styles.title}">Здай домашнє завдання!</h2>
        <p class="${styles.subtitle}">Встав сюди посилання на Google Docs з відкритим доступом</p>

        <label class="${styles.field}">
          <span class="${styles.label}">Ім'я та прізвище</span>
          <input class="${styles.input}" name="name" type="text" autocomplete="name" required />
        </label>

        <label class="${styles.field}">
          <span class="${styles.label}">Посилання на роботу</span>
          <textarea class="${styles.input} ${styles.textarea}" name="answer" rows="4" required
            placeholder="https://docs.google.com/…"></textarea>
        </label>

        <button class="${styles.submit}" type="submit" disabled>
          Відправити домашнє завдання ${icons.send}
        </button>
        <p class="${styles.message}" role="status"></p>
      </div>
    </form>
  `)

  const name = el.querySelector<HTMLInputElement>('input[name="name"]')!
  const answer = el.querySelector<HTMLTextAreaElement>('textarea')!
  const submit = el.querySelector<HTMLButtonElement>('button[type="submit"]')!
  const message = el.querySelector<HTMLElement>('[role="status"]')!

  name.value = readStorage(NAME_KEY) ?? ''

  const showMessage = (text: string, kind: 'success' | 'error' | '' = '') => {
    message.textContent = text
    message.className = cx(styles.message, kind && styles[kind])
  }

  // Кнопка активна, лише коли заповнені ім'я і відповідь
  const updateButton = () => {
    submit.disabled = !name.value.trim() || !answer.value.trim()
  }
  el.addEventListener('input', () => {
    updateButton()
    showMessage('')
  })
  updateButton()

  el.addEventListener('submit', async (e) => {
    e.preventDefault()
    if (submit.disabled) return

    submit.disabled = true
    showMessage('Надсилаємо…')
    writeStorage(NAME_KEY, name.value.trim())

    try {
      await sendHomework({
        ...context,
        studentName: name.value.trim(),
        answer: answer.value.trim(),
        pageUrl: location.href,
      })
      answer.value = ''
      showMessage('Готово! Завдання надіслано на перевірку.', 'success')
      onSubmitted()
    } catch (error) {
      showMessage(
        error instanceof HomeworkNotConfiguredError
          ? 'Відправку ще не налаштовано. Спробуй пізніше.'
          : 'Не вдалося надіслати. Перевір інтернет і спробуй ще раз.',
        'error',
      )
    } finally {
      updateButton()
    }
  })

  return el
}
