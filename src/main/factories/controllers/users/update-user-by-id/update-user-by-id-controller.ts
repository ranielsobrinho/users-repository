import { makeUpdateUserByIdUseCase } from '@/main/factories/usecases/users/update-user-by-id/update-user-by-id-use-case'
import { UpdateUserController } from '@/presentation/controllers/users/update-user-by-id/update-user-by-id-controller'

export const makeUpdateUserByIdController = (): UpdateUserController => {
  return new UpdateUserController(makeUpdateUserByIdUseCase())
}
