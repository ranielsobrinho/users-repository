import express, { Request, Response } from 'express'
import client from 'prom-client'
import logger from './logger'

const app = express()

const KEY = '[Metrics]:'
export function startMetricsServer(): void {
  const collectDefaultMetrics = client.collectDefaultMetrics

  collectDefaultMetrics()
  app.get('/metrics', async (_req: Request, res: Response) => {
    res.set('Content-Type', client.register.contentType)
    return res.send(await client.register.metrics())
  })
  app.listen(9101, () => {
    logger.info(`${KEY} Metrics server started at http://localhost:9101`)
  })
}
