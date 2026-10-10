import { copyFileSync, cpSync, existsSync, rmSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const projectRoot = dirname(fileURLToPath(import.meta.url))

function copyBuildToRepoRoot() {
  return {
    name: 'copy-build-to-repo-root',
    closeBundle() {
      const dist = join(projectRoot, 'dist')
      const indexFrom = join(dist, 'index.html')
      if (!existsSync(indexFrom)) {
        return
      }

      copyFileSync(indexFrom, join(projectRoot, 'index.html'))

      const assetsFrom = join(dist, 'assets')
      const assetsTo = join(projectRoot, 'assets')
      if (existsSync(assetsTo)) {
        rmSync(assetsTo, { recursive: true, force: true })
      }
      if (existsSync(assetsFrom)) {
        cpSync(assetsFrom, assetsTo, { recursive: true })
      }

      for (const file of ['favicon.svg', 'icons.svg', '.nojekyll']) {
        const from = join(dist, file)
        if (existsSync(from)) {
          copyFileSync(from, join(projectRoot, file))
        }
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), copyBuildToRepoRoot()],
  root: 'src',
  base: '/pokedex/',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
})
