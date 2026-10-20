// localStorage може бути недоступний (приватний режим, заблоковані дані), тому всі звернення — у try/catch

export function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // Без збереження просто не пам'ятаємо стан між відвідуваннями
  }
}
