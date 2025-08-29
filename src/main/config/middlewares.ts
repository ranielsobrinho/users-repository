import { Express } from 'express'
import { bodyParser, cors, contentType } from '../middlewares'
import { loggingMiddleware } from '../middlewares/loggin-middleware'

export default (app: Express): void => {
  app.use(bodyParser)
  app.use(cors)
  app.use(contentType)
  app.use(loggingMiddleware)
}
