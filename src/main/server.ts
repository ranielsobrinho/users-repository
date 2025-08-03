import './config/module-alias'
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config()
import DatabaseHelper from '../infra/database/postgres/helpers/postgres-helper'
import shutdownHandlers from './config/shutdownHandlers'
import logger from './config/logger'

const KEY = '[Server]: '
const PORT = process.env.PORT

if (!PORT) {
  logger.error('PORT MUST BE CONFIGURED')
  process.exit(1)
}

DatabaseHelper.connect()
  .then(async () => {
    logger.info('=== Postgres connected ===')
    const app = (await import('./config/app')).default
    const server = app.listen(PORT, () =>
      logger.info(`=== Server running on http://localhost:${PORT} ===`)
    )

    shutdownHandlers.init(server)
  })
  .catch((err) => {
    logger.error(`${KEY} ${err}`)
    process.exit(1)
  })
