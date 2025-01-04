import { Router } from 'express'
import { adaptRoute } from '@/main/adapters/express/express-route-adapter'
import { makeCreateUserController } from '../factories/controllers/users/create-user/create-user-controller'
import { makeListAllUsersController } from '../factories/controllers/users/list-users/list-all-users-controller'
import { makeGetUserByIdController } from '../factories/controllers/users/get-user-by-id/get-user-by-id-controller'
import { makeUpdateUserByIdController } from '../factories/controllers/users/update-user-by-id/update-user-by-id-controller'
import { makeDeleteUserByIdController } from '../factories/controllers/users/delete-user-by-id/delete-user-by-id-controller'
import { makeLoginController } from '../factories/controllers/users/auth-user/auth-user-controller'

export default (router: Router): void => {
  router.post('/signup', adaptRoute(makeCreateUserController()))
  router.post('/login', adaptRoute(makeLoginController()))
  router.get('/users', adaptRoute(makeListAllUsersController()))
  router.get('/users/:userId', adaptRoute(makeGetUserByIdController()))
  router.delete('/users/:userId', adaptRoute(makeDeleteUserByIdController()))
  router.put('/users/:userId', adaptRoute(makeUpdateUserByIdController()))
}
