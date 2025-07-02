import client from 'prom-client'
import { Express, Request, Response } from 'express'

export function startMetricsServer(app: Express): void {
  const collectDefaultMetrics = client.collectDefaultMetrics

  collectDefaultMetrics()
  app.get('/metrics', async (_req: Request, res: Response) => {
    res.set('Content-Type', client.register.contentType)
    return res.send(await client.register.metrics())
  })
}
