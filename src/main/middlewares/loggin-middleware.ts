import { Request, Response, NextFunction } from 'express'
import { requestContext } from '@/shared/request-context'
import { logger } from '@/main/config/pino-logger'
import { randomUUID } from 'crypto'

export function loggingMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const requestId = randomUUID()

  requestContext.run({ requestId }, () => {
    const { method, url, query, body } = req

    logger.info('Request received', {
      message: `${method} ${url} — Request received`,
      query,
      body
    })

    const start = process.hrtime()

    res.on('finish', () => {
      const [seconds, nanoseconds] = process.hrtime(start)
      const durationMs = Number((seconds * 1000 + nanoseconds / 1e6).toFixed(2))

      logger.info('Request finished', {
        message: `${method} ${url} — Responded ${res.statusCode} in ${durationMs}ms`,
        statusCode: res.statusCode,
        durationMs
      })
    })

    next()
  })
}
