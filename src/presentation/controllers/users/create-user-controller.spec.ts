import { describe, expect, it, vi } from 'vitest'
import { CreateUser } from '../../../domain/usecases/users/create-user'
import { Either, right } from '../../../shared'
import { CreateUserController } from './create-user-controller'
import { HttpRequest } from '../../protocols/http'

const makeCreateUserUseCaseStub = (): CreateUser => {
  class CreateUserUseCaseStub implements CreateUser {
    async execute(
      _params: CreateUser.Params
    ): Promise<Either<Error, CreateUser.Result>> {
      return right({ id: 'any_id' })
    }
  }
  return new CreateUserUseCaseStub()
}

const makeCreateUserRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email',
    phone: 'any_phone'
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
      phone: 'any_phone'
    })
  })
})
