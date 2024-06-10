import { makeGetUserByIdUseCase } from '@/main/factories/usecases/users/get-user-by-id/get-user-by-id-use-case'
import { GetUserByIdController } from '@/presentation/controllers/users/get-user-by-id/get-user-by-id-controller'

export const makeGetUserByIdController = (): GetUserByIdController => {
  return new GetUserByIdController(makeGetUserByIdUseCase())
}
