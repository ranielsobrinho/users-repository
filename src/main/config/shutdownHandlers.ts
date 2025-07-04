import { createHttpTerminator } from 'http-terminator'
import DatabaseHelper from '@/infra/database/postgres/helpers/postgres-helper'

import logger from './logger'

const init = (server: any) => {
  const httpTerminator = createHttpTerminator({
    server
  })

  process.on('SIGTERM', async () => {
    logger.warn('SIGTERM signal received: closing HTTP server')
    await httpTerminator.terminate()
    DatabaseHelper.disconnect()
    process.exit(1)
  })

  process.on('SIGINT', async () => {
    logger.warn('SIGINT signal received: closing HTTP server')
    await httpTerminator.terminate()
    DatabaseHelper.disconnect()
    process.exit(1)
  })
}

export default {
  init
}
