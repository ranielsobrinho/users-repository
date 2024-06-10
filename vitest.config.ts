import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      include: [
        '**/src/presentation/**',
        '**/src/data/**',
        '**/src/infra/**',
        '**/src/main/**'
      ],
      exclude: [
        '**/src/main/factories/**',
        '**/src/main/server.ts',
        '**/src/presentation/protocols/index.ts',
        '**/src/main/config/module-alias.ts',
        '**/src/main/adapters/**',
        '**/src/infra/database/postgres/helpers/**'
      ]
    }
  },
  plugins: [tsconfigPaths()]
})
