import { AsyncLocalStorage } from 'node:async_hooks'

const store = new AsyncLocalStorage<Map<string, any>>()

export const requestContext = {
  run: (data: Record<string, any>, callback: () => void) => {
    const map = new Map(Object.entries(data))
    store.run(map, callback)
  },
  get: <T = any>(key: string): T | undefined => {
    const map = store.getStore()
    return map?.get(key)
  }
}
