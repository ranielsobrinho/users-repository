import { CreateUserController } from '@/presentation/controllers/users/create-user/create-user-controller'
import { makeCreateUserUseCase } from '@/main/factories/usecases/users/create-user/create-user-use-case'

export const makeCreateUserController = (): CreateUserController => {
  return new CreateUserController(makeCreateUserUseCase())
}
