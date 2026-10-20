import styles from './HomeworkPanel.module.css'
import type { Lesson } from '../../types'
import { html } from '../../utils/dom'
import { readStorage, writeStorage } from '../../utils/storage'
import type { HomeworkSubmission } from '../../services/homework'
import { HomeworkStatus } from '../HomeworkStatus/HomeworkStatus'
import { HomeworkForm } from '../HomeworkForm/HomeworkForm'
import { HowToSubmit } from '../HowToSubmit/HowToSubmit'

interface HomeworkPanelProps {
  lesson: Lesson
  context: Omit<HomeworkSubmission, 'studentName' | 'answer' | 'pageUrl'>
}

export function HomeworkPanel({ lesson, context }: HomeworkPanelProps) {
  const el = html(`<aside class="${styles.root}" aria-label="Здача домашнього завдання"></aside>`)
  const submittedKey = `educationit:submitted:${lesson.id}`

  let status = HomeworkStatus({ submitted: readStorage(submittedKey) === '1', deadline: lesson.deadline })

  el.append(
    status,
    HomeworkForm({
      context,
      onSubmitted: () => {
        writeStorage(submittedKey, '1')
        const next = HomeworkStatus({ submitted: true, deadline: lesson.deadline })
        status.replaceWith(next)
        status = next
      },
    }),
    HowToSubmit(),
  )

  return el
}
