/** Склеює класи, пропускаючи порожні: cx(styles.item, isActive && styles.active) */
export function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
