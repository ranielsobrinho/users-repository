import vitestConfig from './vitest.config'
import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'

export default mergeConfig(
  vitestConfig,
  defineConfig({
    test: {
      exclude: [...configDefaults.exclude, '**/*.test.ts']
    }
  })
)
