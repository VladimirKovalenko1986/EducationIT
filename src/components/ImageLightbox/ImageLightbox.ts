import styles from './ImageLightbox.module.css'
import { html } from '../../utils/dom'
import { icons } from '../../utils/icons'

interface ImageLightboxProps {
  /** Область, у якій картинки збільшуються по кліку (зміст уроку) */
  target: HTMLElement
}

/** Збільшення картинки на весь екран: клік або Enter по картинці відкриває, клік/Esc — закриває */
export function ImageLightbox({ target }: ImageLightboxProps) {
  const el = html<HTMLDialogElement>(`
    <dialog class="${styles.root}" aria-label="Перегляд зображення">
      <button class="${styles.close}" type="button" aria-label="Закрити">${icons.close}</button>
      <figure class="${styles.figure}">
        <img class="${styles.image}" alt="" />
        <figcaption class="${styles.caption}"></figcaption>
      </figure>
    </dialog>
  `)

  const image = el.querySelector('img')!
  const caption = el.querySelector('figcaption')!

  // Картинки стають «кнопками»: до них можна дійти Tab-ом і відкрити Enter-ом
  for (const img of target.querySelectorAll('img')) {
    img.tabIndex = 0
    img.setAttribute('role', 'button')
    img.setAttribute('aria-label', `Збільшити: ${img.alt}`)
  }

  const open = (img: HTMLImageElement) => {
    image.src = img.currentSrc || img.src
    image.alt = img.alt
    caption.textContent = img.closest('figure')?.querySelector('figcaption')?.textContent ?? ''
    el.showModal()
  }

  target.addEventListener('click', (e) => {
    const img = (e.target as HTMLElement).closest('img')
    if (img) open(img)
  })
  target.addEventListener('keydown', (e) => {
    const img = (e.target as HTMLElement).closest('img')
    if (img && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      open(img)
    }
  })

  // Будь-який клік у відкритому вікні закриває його (Esc закриває сам <dialog>)
  el.addEventListener('click', () => el.close())

  return el
}
