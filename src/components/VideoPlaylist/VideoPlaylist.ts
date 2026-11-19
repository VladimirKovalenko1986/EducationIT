import styles from './VideoPlaylist.module.css'
import { html } from '../../utils/dom'

interface Video {
  /** id відео на YouTube */
  id: string
  title: string
  /** Підпис під назвою: модуль, дата тощо */
  meta?: string
}

/** Витягає id відео з посилання youtu.be/ID, youtube.com/watch?v=ID або youtube.com/embed/ID */
export function youtubeId(url: string) {
  const match = url.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/)([\w-]{11})/)
  return match?.[1] ?? ''
}

const escape = (text: string) =>
  text.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!)

/**
 * Плеєр YouTube зі списком відео: натискання на пункт списку відкриває це відео в плеєрі.
 * У конспекті записується так:
 * <ul data-video-playlist>
 *   <li><a href="https://youtu.be/ID" data-meta="Підпис">Назва відео</a></li>
 * </ul>
 */
export function VideoPlaylist({ videos }: { videos: Video[] }) {
  const el = html(`
    <section class="${styles.root}" aria-label="Відеоуроки">
      <div class="${styles.player}">
        <iframe
          title="${escape(videos[0].title)}"
          src="https://www.youtube-nocookie.com/embed/${videos[0].id}?rel=0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerpolicy="strict-origin-when-cross-origin"
          allowfullscreen
        ></iframe>
      </div>
      <div class="${styles.current}">
        <p class="${styles.currentTitle}">${escape(videos[0].title)}</p>
        <p class="${styles.currentMeta}"${videos[0].meta ? '' : ' hidden'}>${escape(videos[0].meta ?? '')}</p>
      </div>
      <ol class="${styles.list}">
        ${videos
          .map(
            (v, i) => `
              <li>
                <button class="${styles.item}" type="button" data-index="${i}" aria-current="${i === 0}">
                  <span class="${styles.icon}" aria-hidden="true"></span>
                  <span class="${styles.itemText}">
                    <span>${escape(v.title)}</span>
                    ${v.meta ? `<small>${escape(v.meta)}</small>` : ''}
                  </span>
                </button>
              </li>`,
          )
          .join('')}
      </ol>
    </section>
  `)

  const iframe = el.querySelector('iframe')!
  const title = el.querySelector<HTMLElement>(`.${styles.currentTitle}`)!
  const meta = el.querySelector<HTMLElement>(`.${styles.currentMeta}`)!
  const items = [...el.querySelectorAll<HTMLButtonElement>(`.${styles.item}`)]

  el.addEventListener('click', (e) => {
    const button = (e.target as HTMLElement).closest<HTMLButtonElement>(`.${styles.item}`)
    if (!button) return
    const video = videos[Number(button.dataset.index)]
    // Після вибору відео одразу запускаємо його
    iframe.src = `https://www.youtube-nocookie.com/embed/${video.id}?rel=0&autoplay=1`
    iframe.title = video.title
    title.textContent = video.title
    meta.textContent = video.meta ?? ''
    meta.hidden = !video.meta
    for (const item of items) item.setAttribute('aria-current', String(item === button))
    el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
  })

  return el
}

/** Замінює розмітку списків відео в уроці на плеєр */
export function mountVideoPlaylists(root: HTMLElement) {
  root.querySelectorAll<HTMLElement>('[data-video-playlist]').forEach((node) => {
    const videos = [...node.querySelectorAll<HTMLAnchorElement>('a[href]')]
      .map((a) => ({ id: youtubeId(a.href), title: a.textContent?.trim() ?? '', meta: a.dataset.meta }))
      .filter((v) => v.id)
    if (videos.length) node.replaceWith(VideoPlaylist({ videos }))
  })
}
