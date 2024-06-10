import { Router } from 'express'
import { adaptRoute } from '@/main/adapters/express/express-route-adapter'
import { makeCreateUserController } from '../factories/controllers/users/create-user/create-user-controller'
import { makeListAllUsersController } from '../factories/controllers/users/list-users/list-all-users-controller'
import { makeGetUserByIdController } from '../factories/controllers/users/get-user-by-id/get-user-by-id-controller'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeCreateUserController()))
  router.get('/users', adaptRoute(makeListAllUsersController()))
  router.get('/users/:userId', adaptRoute(makeGetUserByIdController()))
}
