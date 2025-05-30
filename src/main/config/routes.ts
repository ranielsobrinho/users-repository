import { Express, Router } from 'express'
import { readdirSync } from 'fs'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)

  router.get('/health', (_req, res) => {
    res.send({ Status: 'OK' })
  })

  readdirSync(`${__dirname}/../routes`).forEach(async (file) => {
    if (!file.includes('.test.')) {
      ;(await import(`../routes/${file}`)).default(router)
    }
  })
}
