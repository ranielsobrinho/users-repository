import { describe, it, expect, vi } from 'vitest'
import { Authentication } from '../../../domain/usecases/authentication/authentication'
import { Either, right } from '../../../shared'
import { HttpRequest } from '../../protocols/http'
import { LoginController } from './login-controller'

const makeLoginRequest = (): HttpRequest => ({
  body: {
    email: 'any_email',
    phone: 'any_phone'
  }
})

describe('LoginController', () => {
  it('Should call AuthenticationUseCase with correct params', async () => {
    class AuthenticationUseCaseStub implements Authentication {
      async execute(
        _params: Authentication.Params
      ): Promise<Either<Error, Authentication.Result>> {
        return right('any_token')
      }
    }
    const authenticationUseCaseStub = new AuthenticationUseCaseStub()
    const sut = new LoginController(authenticationUseCaseStub)
    const authSpy = vi.spyOn(authenticationUseCaseStub, 'execute')
    await sut.handle(makeLoginRequest())
    expect(authSpy).toHaveBeenCalledWith(makeLoginRequest().body)
  })
})
