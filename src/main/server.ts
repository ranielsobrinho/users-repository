import './config/module-alias'
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config()
import DatabaseHelper from '../infra/database/postgres/helpers/postgres-helper'
import logger from './config/logger'

const KEY = '[Server]: '
DatabaseHelper.connect()
  .then(async () => {
    logger.info('=== Postgres connected ===')
    const app = (await import('./config/app')).default
    app.listen(5000, () =>
      logger.info(`=== Server running on http://localhost:5000 ===`)
    )
  })
  .catch((err) => {
    logger.error(`${KEY} ${err}`)
    process.exit(1)
  })
