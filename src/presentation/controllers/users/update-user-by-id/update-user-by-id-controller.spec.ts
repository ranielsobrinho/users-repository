import { describe, it, expect, vi } from 'vitest'
import { UpdateUserById } from '../../../../domain/usecases/users/update-user-by-id'
import { Either, left, right } from '../../../../shared'
import { UserModel } from '../../../../domain/models/user-model'
import { UpdateUserController } from './update-user-by-id-controller'
import { HttpRequest } from '../../../protocols/http'
import {
  badRequest,
  notFound,
  ok,
  serverError
} from '../../../helpers/http-helper'
import { NotFoundError, RequiredFieldError } from '../../../errors'

const makeUserModel = (): UserModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email',
  phone: 'any_phone',
  password: 'hashed_password'
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

  it('Should return 404 if UpdateUserUseCase returns NotFoundError', async () => {
    const { sut, updateUserUseCaseStub } = makeSut()
    vi.spyOn(updateUserUseCaseStub, 'execute').mockResolvedValueOnce(
      left(new NotFoundError())
    )
    const response = await sut.handle(makeUpdateRequest())
    expect(response).toEqual(notFound(new NotFoundError()))
  })

  it('Should return 400 if UpdateUserUseCase returns param error', async () => {
    const { sut, updateUserUseCaseStub } = makeSut()
    vi.spyOn(updateUserUseCaseStub, 'execute').mockResolvedValueOnce(
      left(new RequiredFieldError('phone'))
    )
    const response = await sut.handle({
      params: {
        userId: 'any_id'
      },
      body: {
        name: 'any_name',
        email: 'any_email',
        phone: undefined
      }
    })
    expect(response).toEqual(badRequest(new RequiredFieldError('phone')))
  })

  it('Should return 200 if UpdateUserUseCase on success ', async () => {
    const { sut } = makeSut()
    const response = await sut.handle(makeUpdateRequest())
    expect(response).toEqual(ok(makeUserModel()))
  })
})
