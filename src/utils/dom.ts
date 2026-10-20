/** Створює DOM-елемент з HTML-рядка (береться перший кореневий елемент) */
export function html<T extends HTMLElement = HTMLElement>(markup: string): T {
  const template = document.createElement('template')
  template.innerHTML = markup.trim()
  return template.content.firstElementChild as T
}
