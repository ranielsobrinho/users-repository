import express from 'express'
import setupRoutes from './routes'
import setupMiddlewares from './middlewares'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'

morgan.token('body', (req: express.Request) => {
  const isNotGet = req.method !== 'GET'
  if (isNotGet) {
    return JSON.stringify(req.body)
  }
  return 'body-empty'
})

const app = express()
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  })
)
app.use(morgan(':date[iso] :method :url :status :body - :total-time ms'))
app.use(helmet())
app.use(compression({ level: 6 }))
setupMiddlewares(app)
setupRoutes(app)

export default app
