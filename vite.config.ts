import { createHash } from 'node:crypto'
import { basename } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  css: {
    modules: {
      // Читабельні класи в DevTools: Header_root_x7a3f
      generateScopedName: (name, filename) => {
        const component = basename(filename).replace(/\.module\.css$/, '')
        const hash = createHash('md5').update(filename).digest('base64url').slice(0, 5)
        return `${component}_${name}_${hash}`
      },
    },
  },
})
