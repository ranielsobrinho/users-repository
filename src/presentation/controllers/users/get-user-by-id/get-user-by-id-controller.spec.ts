import { describe, it, expect, vi } from 'vitest'
import { GetUserById } from '../../../../domain/usecases/users/get-user-by-id'
import { Either, left, right } from '../../../../shared'
import { GetUserByIdController } from './get-user-by-id-controller'
import { UserModel } from '../../../../domain/models/user-model'
import { notFound, ok, serverError } from '../../../helpers/http-helper'
import { NotFoundError } from '../../../errors/not-found-error'
import { HttpRequest } from '../../../protocols'

const makeUserModel = (): UserModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email',
  phone: 'any_phone'
})

const makeGetUserRequest = (): HttpRequest => ({
  params: {
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

  it('Should return 500 if GetUserByIdUseCase throws', async () => {
    const { sut, getUserByIdUseCaseStub } = makeSut()
    vi.spyOn(getUserByIdUseCaseStub, 'execute').mockRejectedValueOnce(
      new Error()
    )
    const httpResponse = await sut.handle(makeGetUserRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 404 if GetUserByIdUseCase returns null', async () => {
    const { sut, getUserByIdUseCaseStub } = makeSut()
    vi.spyOn(getUserByIdUseCaseStub, 'execute').mockResolvedValueOnce(
      left(new NotFoundError())
    )
    const httpResponse = await sut.handle(makeGetUserRequest())
    expect(httpResponse).toEqual(notFound(new NotFoundError()))
  })

  it('Should return 200 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeGetUserRequest())
    expect(httpResponse).toEqual(ok(makeUserModel()))
  })
})
