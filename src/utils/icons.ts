const svg = (path: string) =>
  `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`

export const icons = {
  home: svg('<path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/>'),
  arrow: svg('<path d="M5 12h14"/><path d="m13 6 6 6-6 6"/>'),
  chevron: svg('<path d="m6 9 6 6 6-6"/>'),
  search: svg('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
  menu: svg('<path d="M4 6h16M4 12h16M4 18h16"/>'),
}
