import styles from './CodeTask.module.css'
import { html } from '../../utils/dom'
import { cx } from '../../utils/cx'
import { icons } from '../../utils/icons'
import { readStorage, writeStorage } from '../../utils/storage'
import { passes } from './checks'

interface Requirement {
  /** HTML-текст вимоги для чекліста */
  label: string
  /** Правила перевірки (див. checks.ts) */
  check: string
}

interface CodeTaskProps {
  /** Унікальний id: за ним зберігаються код і статус */
  id: string
  title: string
  /** HTML-опис завдання */
  description: string
  startCode: string
  requirements: Requirement[]
  /** HTML з рішенням (<details>), показується під редактором */
  solution?: HTMLElement
}

interface SavedState {
  code: string
  done: boolean
}

export function CodeTask({ id, title, description, startCode, requirements, solution }: CodeTaskProps) {
  const storageKey = `educationit:task:${id}`
  const saved = (() => {
    try {
      return JSON.parse(readStorage(storageKey) ?? 'null') as SavedState | null
    } catch {
      return null
    }
  })()

  const el = html(`
    <section class="${styles.root}">
      <header class="${styles.header}">
        <h4 class="${styles.title}">${title}</h4>
        <span class="${styles.status}"></span>
      </header>
      <div class="${styles.description}">${description}</div>

      <div class="${styles.workspace}">
        <div class="${styles.pane}">
          <div class="${styles.paneLabel}">index.html</div>
          <textarea class="${styles.editor}" spellcheck="false" autocapitalize="off" autocomplete="off"
            aria-label="Редактор коду: ${title}"></textarea>
        </div>
        <div class="${styles.pane}">
          <div class="${styles.paneLabel}">Результат</div>
          <iframe class="${styles.preview}" sandbox="" title="Результат: ${title}"></iframe>
        </div>
      </div>

      <div class="${styles.actions}">
        <button class="${styles.check}" type="button">${icons.check} Перевірити</button>
        <button class="${styles.reset}" type="button">${icons.reset} Скинути</button>
      </div>

      <ul class="${styles.requirements}">
        ${requirements.map((r) => `<li class="${styles.requirement}">${r.label}</li>`).join('')}
      </ul>
      <p class="${styles.message}" role="status"></p>
    </section>
  `)

  const editor = el.querySelector('textarea')!
  const preview = el.querySelector('iframe')!
  const status = el.querySelector<HTMLElement>(`.${styles.status}`)!
  const message = el.querySelector<HTMLElement>(`.${styles.message}`)!
  const items = [...el.querySelectorAll<HTMLElement>(`.${styles.requirement}`)]
  if (solution) el.append(solution)

  let done = saved?.done ?? false
  editor.value = saved?.code ?? startCode

  const save = () => writeStorage(storageKey, JSON.stringify({ code: editor.value, done } satisfies SavedState))

  const renderStatus = () => {
    status.textContent = done ? 'Виконано' : 'Не виконано'
    status.className = cx(styles.status, done && styles.statusDone)
    el.classList.toggle(styles.done, done)
  }

  // Попередній перегляд: sandbox без скриптів, оновлюється з невеликою затримкою
  let timer = 0
  const renderPreview = () => {
    preview.srcdoc = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>
      body{font-family:system-ui,sans-serif;margin:12px;color:#13233a;background:#fff;line-height:1.5}
      img{max-width:100%}</style></head><body>${editor.value}</body></html>`
  }
  const schedulePreview = () => {
    clearTimeout(timer)
    timer = window.setTimeout(renderPreview, 300)
  }

  const clearMarks = () => {
    for (const item of items) item.classList.remove(styles.passed, styles.failed)
    message.textContent = ''
    message.className = styles.message
  }

  const runChecks = () => {
    const results = requirements.map((r) => passes(editor.value, r.check))
    results.forEach((ok, i) => {
      items[i].classList.toggle(styles.passed, ok)
      items[i].classList.toggle(styles.failed, !ok)
    })
    const allPassed = results.every(Boolean)
    if (allPassed) done = true
    message.textContent = allPassed
      ? 'Чудово! Усі вимоги виконано.'
      : `Виконано ${results.filter(Boolean).length} з ${results.length}. Виправ позначені пункти і перевір ще раз.`
    message.className = cx(styles.message, allPassed ? styles.success : styles.error)
    save()
    renderStatus()
  }

  editor.addEventListener('input', () => {
    clearMarks()
    save()
    schedulePreview()
  })

  // Tab вставляє 2 пробіли замість переходу на наступний елемент
  editor.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || e.shiftKey) return
    e.preventDefault()
    editor.setRangeText('  ', editor.selectionStart, editor.selectionEnd, 'end')
    editor.dispatchEvent(new Event('input'))
  })

  el.querySelector(`.${styles.check}`)!.addEventListener('click', runChecks)
  el.querySelector(`.${styles.reset}`)!.addEventListener('click', () => {
    editor.value = startCode
    clearMarks()
    save()
    renderPreview()
  })

  renderStatus()
  renderPreview()
  if (done) runChecks()

  return el
}

/**
 * Перетворює розмітку завдання в конспекті на інтерактивний редактор:
 * <section data-kind="task">
 *   <h4>Назва</h4> <p>Опис…</p>
 *   <ul data-kind="checklist"><li data-check="exists:p">Вимога</li></ul>
 *   <pre data-start><code>стартовий код</code></pre>
 *   <details>…рішення…</details>
 * </section>
 * Завдання без <pre data-start> лишаються звичайними картками.
 */
export function mountCodeTasks(root: HTMLElement, lessonId: string) {
  root.querySelectorAll<HTMLElement>('[data-kind="task"]').forEach((node, index) => {
    const start = node.querySelector('pre[data-start]')
    const checklist = node.querySelector('[data-kind="checklist"]')
    if (!start || !checklist) return

    const requirements = [...checklist.querySelectorAll<HTMLElement>('li')].map((li) => ({
      label: li.innerHTML,
      check: li.dataset.check ?? '',
    }))
    const title = node.querySelector('h4')?.textContent ?? 'Практичне завдання'
    const solution = node.querySelector<HTMLElement>('details') ?? undefined

    node.querySelector('h4')?.remove()
    start.remove()
    checklist.remove()
    solution?.remove()

    node.replaceWith(
      CodeTask({
        id: `${lessonId}:${index}`,
        title,
        description: node.innerHTML,
        startCode: start.textContent ?? '',
        requirements,
        solution,
      }),
    )
  })
}
