import { makeAuthenticateUseCase } from '@/main/factories/usecases/users/auth-user/auth-user-use-case'
import { LoginController } from '@/presentation/controllers/login/login-controller'
import { Controller } from '@/presentation/protocols'

export const makeLoginController = (): Controller => {
  return new LoginController(makeAuthenticateUseCase())
}
