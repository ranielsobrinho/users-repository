import { makeListAllUsersUseCase } from '@/main/factories/usecases/users/list-users/list-all-users-use-case'
import { ListAllUsersController } from '@/presentation/controllers/users/list-all-users/list-all-users-controller'

export const makeListAllUsersController = (): ListAllUsersController => {
  return new ListAllUsersController(makeListAllUsersUseCase())
}
