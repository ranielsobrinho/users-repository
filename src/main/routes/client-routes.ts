import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware'
import { Router } from 'express'
import { adaptRoute } from '../adapters/express/express-route-adapter'
import { makeCreateClientController } from '../factories/controllers/clients/create-client/create-client-controller'

export default (router: Router): void => {
  const authMiddleware = new AuthMiddleware().handle

  router.post(
    '/clients',
    authMiddleware,
    adaptRoute(makeCreateClientController())
  )
}
