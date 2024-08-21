import { makeDeleteUserByIdUseCase } from '@/main/factories/usecases/users/delete-user-by-id/delete-user-by-id-use-case'
import { DeleteUserByIdController } from '@/presentation/controllers/users/delete-user/delete-user-by-id-controller'

export const makeDeleteUserByIdController = (): DeleteUserByIdController => {
  return new DeleteUserByIdController(makeDeleteUserByIdUseCase())
}
