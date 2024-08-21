import { describe, it, expect, vi } from 'vitest'
import { UpdateUserById } from '../../../../domain/usecases/users/update-user-by-id'
import { Either, right } from '../../../../shared'
import { UserModel } from '../../../../domain/models/user-model'
import { UpdateUserController } from './update-user-by-id-controller'
import { HttpRequest } from '../../../protocols/http'
import { serverError } from '../../../helpers/http-helper'

const makeUserModel = (): UserModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email',
  phone: 'any_phone'
})

const makeUpdateRequest = (): HttpRequest => ({
  params: {
    userId: 'any_id'
  },
  body: {
    name: 'any_name',
    email: 'any_email',
    phone: 'any_phone'
  }
})

const makeUpdateUserUseCaseStub = (): UpdateUserById => {
  class UpdateUserUseCaseStub implements UpdateUserById {
    async execute(
      _userId: string,
      _params: UpdateUserById.Params
    ): Promise<Either<Error, UserModel>> {
      return right(makeUserModel())
    }
  }
  return new UpdateUserUseCaseStub()
}

type SutTypes = {
  sut: UpdateUserController
  updateUserUseCaseStub: UpdateUserById
}

const makeSut = (): SutTypes => {
  const updateUserUseCaseStub = makeUpdateUserUseCaseStub()
  const sut = new UpdateUserController(updateUserUseCaseStub)
  return {
    sut,
    updateUserUseCaseStub
  }
}

describe('UpdateUserController', () => {
  it('Should call UpdateUserUseCase with correct params', async () => {
    const { sut, updateUserUseCaseStub } = makeSut()
    const updateUserSpy = vi.spyOn(updateUserUseCaseStub, 'execute')
    await sut.handle(makeUpdateRequest())
    expect(updateUserSpy).toHaveBeenCalledWith(
      makeUpdateRequest().params.userId,
      makeUpdateRequest().body
    )
    expect(updateUserSpy).toHaveBeenCalledOnce()
  })

  it('Should return 500 if UpdateUserUseCase throws', async () => {
    const { sut, updateUserUseCaseStub } = makeSut()
    vi.spyOn(updateUserUseCaseStub, 'execute').mockRejectedValueOnce(
      new Error()
    )
    const response = await sut.handle(makeUpdateRequest())
    expect(response).toEqual(serverError(new Error()))
  })
})
