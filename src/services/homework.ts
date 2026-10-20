// Відправка домашніх завдань на пошту через Web3Forms (сервер не потрібен).
// Лист приходить на адресу, до якої прив'язаний ключ VITE_WEB3FORMS_KEY (див. .env.example).

const ENDPOINT = 'https://api.web3forms.com/submit'
const ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_KEY

export interface HomeworkSubmission {
  studentName: string
  answer: string
  course: string
  block: string
  module: string
  lesson: string
  pageUrl: string
}

export class HomeworkNotConfiguredError extends Error {}

export const isHomeworkSendingConfigured = () => Boolean(ACCESS_KEY)

export async function sendHomework(submission: HomeworkSubmission) {
  if (!ACCESS_KEY) throw new HomeworkNotConfiguredError('Відправку домашніх завдань ще не налаштовано')

  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      access_key: ACCESS_KEY,
      subject: `ДЗ: ${submission.course} · ${submission.module} · ${submission.studentName}`,
      from_name: 'EducationIT',
      'Студент': submission.studentName,
      'Курс': submission.course,
      'Блок': submission.block,
      'Модуль': submission.module,
      'Завдання': submission.lesson,
      'Відповідь': submission.answer,
      'Сторінка': submission.pageUrl,
    }),
  })

  const result = (await response.json().catch(() => ({}))) as { success?: boolean; message?: string }
  if (!response.ok || !result.success) throw new Error(result.message || 'Не вдалося надіслати завдання')
}
