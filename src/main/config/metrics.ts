import express, { Request, Response } from 'express'
import client from 'prom-client'

const app = express()

export function startMetricsServer(): void {
  const collectDefaultMetrics = client.collectDefaultMetrics

  collectDefaultMetrics()
  app.get('/metrics', async (_req: Request, res: Response) => {
    res.set('Content-Type', client.register.contentType)
    return res.send(await client.register.metrics())
  })
  app.listen(9101, () => {
    console.log('❕ Metrics server started at http://localhost:9101')
  })
}
