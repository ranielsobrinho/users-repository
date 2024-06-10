import 'module-alias/register'
require('dotenv').config()
import DatabaseHelper from '../infra/database/postgres/helpers/postgres-helper'

DatabaseHelper.connect()
  .then(async () => {
    console.log('=== Postgres connected ===')
    const app = (await import('./config/app')).default
    app.listen(5000, () =>
      console.log(`=== Server running on http://localhost:5000 ===`)
    )
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
