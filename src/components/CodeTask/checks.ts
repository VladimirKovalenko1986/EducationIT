// Автоперевірка HTML-коду студента. Кожна вимога чекліста описується рядком
// data-check="правило; правило", усі правила мають виконатися.
//
// Ціль (SPEC) — CSS-селектор або «селектор=текст» (елемент з таким текстом):
//   exists:SPEC              є такий елемент
//   count:SEL=N              рівно N елементів
//   contains:SEL=ТЕКСТ       перший елемент містить текст
//   attr:SEL@атрибут=знач.   у першого елемента атрибут має значення
//   before:SPEC,SPEC         перший стоїть раніше за другий
//   between:SPEC,SPEC,SPEC   перший стоїть між другим і третім
//   items:SEL=a|b|c          елементи списку SEL > li мають саме ці тексти
//   noText:SEL               усі такі елементи є і не містять тексту
//   source:a|b|c             у самому коді є хоча б один із фрагментів (без урахування регістру)
//   order:a|b|c              у самому коді є всі фрагменти саме в такому порядку
// Код з <!DOCTYPE> або <html> розбирається як повний документ (з <html>, <head>, <body>)
//   opening:тег / closing:тег   у коді є відкриваючий / закриваючий тег
//   comment / comment:ТЕКСТ  у коді є коментар (з таким текстом)
//   commentBefore:SPEC       коментар стоїть перед елементом

const normalize = (text: string) => text.replace(/\s+/g, ' ').trim()

type Root = ParentNode & Node

export function parseHtml(code: string): Root {
  // Повний документ (з <!DOCTYPE> чи <html>) розбираємо як є, щоб у ньому були справжні <html>, <head> і <body>
  if (/<!doctype|<html[\s>]/i.test(code)) return new DOMParser().parseFromString(code, 'text/html')
  // Фрагмент — у явному <body>, щоб коментарі на початку коду теж потрапили в body
  return new DOMParser().parseFromString(`<!DOCTYPE html><html><head></head><body>${code}</body></html>`, 'text/html')
    .body
}

function find(root: Root, spec: string) {
  const [selector, ...text] = spec.split('=')
  let nodes: Element[]
  try {
    nodes = [...root.querySelectorAll(selector.trim())]
  } catch {
    return undefined
  }
  if (!text.length) return nodes[0]
  const expected = normalize(text.join('='))
  return nodes.find((node) => normalize(node.textContent ?? '') === expected)
}

function comments(root: Root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_COMMENT)
  const result: Comment[] = []
  while (walker.nextNode()) result.push(walker.currentNode as Comment)
  return result
}

const precedes = (a?: Node, b?: Node) =>
  Boolean(a && b && a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING)

function rule(root: Root, code: string, raw: string): boolean {
  const index = raw.indexOf(':')
  const name = (index < 0 ? raw : raw.slice(0, index)).trim()
  const arg = index < 0 ? '' : raw.slice(index + 1).trim()

  switch (name) {
    case 'exists':
      return Boolean(find(root, arg))
    case 'count': {
      const [selector, n] = arg.split('=')
      return root.querySelectorAll(selector.trim()).length === Number(n)
    }
    case 'contains': {
      const [selector, ...text] = arg.split('=')
      const node = root.querySelector(selector.trim())
      return Boolean(node && normalize(node.textContent ?? '').includes(normalize(text.join('='))))
    }
    case 'attr': {
      const [left, ...value] = arg.split('=')
      const [selector, attribute] = left.split('@')
      const node = root.querySelector(selector.trim())
      return Boolean(node && node.getAttribute(attribute.trim())?.trim() === value.join('=').trim())
    }
    case 'before': {
      const [a, b] = arg.split(',')
      return precedes(find(root, a), find(root, b))
    }
    case 'between': {
      const [target, start, end] = arg.split(',')
      const node = find(root, target)
      return precedes(find(root, start), node) && precedes(node, find(root, end))
    }
    case 'items': {
      const [selector, list] = arg.split('=')
      const expected = list.split('|').map(normalize)
      const actual = [...root.querySelectorAll(`${selector.trim()} > li`)].map((li) => normalize(li.textContent ?? ''))
      return actual.length === expected.length && expected.every((text, i) => actual[i] === text)
    }
    case 'order': {
      // Фрагменти мають іти в самому коді саме в такому порядку
      const lower = code.toLowerCase()
      let from = 0
      for (const part of arg.split('|')) {
        const index = lower.indexOf(part.trim().toLowerCase(), from)
        if (index < 0) return false
        from = index + part.trim().length
      }
      return true
    }
    case 'source':
      return arg.split('|').some((part) => code.toLowerCase().includes(part.trim().toLowerCase()))
    case 'noText': {
      const nodes = [...root.querySelectorAll(arg)]
      return nodes.length > 0 && nodes.every((node) => normalize(node.textContent ?? '') === '')
    }
    case 'opening':
      return new RegExp(`<${arg}(\\s|>|/)`, 'i').test(code)
    case 'closing':
      return new RegExp(`</${arg}\\s*>`, 'i').test(code)
    case 'comment':
      return arg ? comments(root).some((c) => normalize(c.data) === normalize(arg)) : comments(root).length > 0
    case 'commentBefore':
      return precedes(comments(root)[0], find(root, arg))
    default:
      console.warn(`Невідоме правило перевірки: ${name}`)
      return false
  }
}

/** Чи виконується вимога (усі правила через «;») */
export function passes(code: string, check: string) {
  const root = parseHtml(code)
  return check
    .split(';')
    .map((r) => r.trim())
    .filter(Boolean)
    .every((r) => rule(root, code, r))
}
