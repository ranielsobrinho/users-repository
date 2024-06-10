import { describe, it, expect, vi } from 'vitest'
import { GetUserById } from '../../../../domain/usecases/users/get-user-by-id'
import { Either, right } from '../../../../shared'
import { GetUserByIdController } from './get-user-by-id-controller'
import { UserModel } from '../../../../domain/models/user-model'

const makeUserModel = (): UserModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email',
  phone: 'any_phone'
})

const makeGetUserRequest = () => ({
  body: {
    userId: 'any_id'
  }
})

const makeGetUserByIdUseCaseStub = (): GetUserById => {
  class GetUserByIdUseCaseStub implements GetUserById {
    async execute(_userId: string): Promise<Either<Error, any>> {
      return right(makeUserModel())
    }
  }
  return new GetUserByIdUseCaseStub()
}

type SutTypes = {
  sut: GetUserByIdController
  getUserByIdUseCaseStub: GetUserById
}

const makeSut = (): SutTypes => {
  const getUserByIdUseCaseStub = makeGetUserByIdUseCaseStub()
  const sut = new GetUserByIdController(getUserByIdUseCaseStub)
  return {
    sut,
    getUserByIdUseCaseStub
  }
}

describe('GetUserByIdController', () => {
  it('Should call GetUserByIdUseCase with correct param', async () => {
    const { sut, getUserByIdUseCaseStub } = makeSut()
    const getByIdSpy = vi.spyOn(getUserByIdUseCaseStub, 'execute')
    await sut.handle(makeGetUserRequest())
    expect(getByIdSpy).toHaveBeenCalledOnce()
    expect(getByIdSpy).toHaveBeenCalledWith('any_id')
  })
})
