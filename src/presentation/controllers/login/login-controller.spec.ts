import { describe, it, expect, vi } from 'vitest'
import { Authentication } from '../../../domain/usecases/authentication/authentication'
import { Either, right } from '../../../shared'
import { HttpRequest } from '../../protocols/http'
import { LoginController } from './login-controller'
import { serverError } from '../../helpers/http-helper'

const makeLoginRequest = (): HttpRequest => ({
  body: {
    email: 'any_email',
    phone: 'any_phone'
  }
})

const makeAuthenticationUseCaseStub = (): Authentication => {
  class AuthenticationUseCaseStub implements Authentication {
    async execute(
      _params: Authentication.Params
    ): Promise<Either<Error, Authentication.Result>> {
      return right('any_token')
    }
  }
  return new AuthenticationUseCaseStub()
}

type SutTypes = {
  sut: LoginController
  authenticationUseCaseStub: Authentication
}

const makeSut = (): SutTypes => {
  const authenticationUseCaseStub = makeAuthenticationUseCaseStub()
  const sut = new LoginController(authenticationUseCaseStub)
  return {
    sut,
    authenticationUseCaseStub
  }
}

describe('LoginController', () => {
  it('Should call AuthenticationUseCase with correct params', async () => {
    const { sut, authenticationUseCaseStub } = makeSut()
    const authSpy = vi.spyOn(authenticationUseCaseStub, 'execute')
    await sut.handle(makeLoginRequest())
    expect(authSpy).toHaveBeenCalledWith(makeLoginRequest().body)
  })

  it('Should return 500 if AuthenticationUseCase throws', async () => {
    const { sut, authenticationUseCaseStub } = makeSut()
    vi.spyOn(authenticationUseCaseStub, 'execute').mockRejectedValueOnce(
      new Error()
    )
    const httpResponse = await sut.handle(makeLoginRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
