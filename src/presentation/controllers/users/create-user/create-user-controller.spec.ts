import { describe, expect, it, vi } from 'vitest'
import { CreateUser } from '../../../../domain/usecases/users/create-user'
import { Either, left, right } from '../../../../shared'
import { CreateUserController } from './create-user-controller'
import { HttpRequest } from '../../../protocols/http'
import { badRequest, ok, serverError } from '../../../helpers/http-helper'

class EmailAlreadyInUseError extends Error {
  constructor(email: string) {
    super(`Email ${email} already in use.`)
    this.name = 'EmailAlreadyInUseError'
  }
}

const makeCreateUserUseCaseStub = (): CreateUser => {
  class CreateUserUseCaseStub implements CreateUser {
    async execute(
      _params: CreateUser.Params
    ): Promise<Either<Error, CreateUser.Result>> {
      return right('any_token')
    }
  }
  return new CreateUserUseCaseStub()
}

const makeCreateUserRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email',
    phone: 'any_phone',
    password: 'any_password'
  }
})

type SutTypes = {
  sut: CreateUserController
  createUserUseCaseStub: CreateUser
}

const makeSut = (): SutTypes => {
  const createUserUseCaseStub = makeCreateUserUseCaseStub()
  const sut = new CreateUserController(createUserUseCaseStub)
  return {
    sut,
    createUserUseCaseStub
  }
}

describe('CreateUserController', () => {
  it('Should call CreateUserUseCase with correct params', async () => {
    const { sut, createUserUseCaseStub } = makeSut()
    const creatUserSpy = vi.spyOn(createUserUseCaseStub, 'execute')
    await sut.handle(makeCreateUserRequest())
    expect(creatUserSpy).toHaveBeenCalledOnce()
    expect(creatUserSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email',
      phone: 'any_phone',
      password: 'any_password'
    })
  })

  it('Should return 500 if CreateUser throws', async () => {
    const { sut, createUserUseCaseStub } = makeSut()
    vi.spyOn(createUserUseCaseStub, 'execute').mockRejectedValueOnce(
      new Error()
    )
    const httpResponse = await sut.handle(makeCreateUserRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 400 if CreateUser returns a EmailAlreadyInUse error', async () => {
    const { sut, createUserUseCaseStub } = makeSut()
    vi.spyOn(createUserUseCaseStub, 'execute').mockResolvedValueOnce(
      left(new EmailAlreadyInUseError(makeCreateUserRequest().body.email))
    )
    const httpResponse = await sut.handle(makeCreateUserRequest())
    expect(httpResponse).toEqual(
      badRequest(new EmailAlreadyInUseError(makeCreateUserRequest().body.email))
    )
  })

  it('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeCreateUserRequest())
    expect(httpResponse).toEqual(ok({ token: 'any_token' }))
  })
})
