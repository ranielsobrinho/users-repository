import { describe, it, expect, vi } from 'vitest'
import { UpdateUserById } from '../../../../domain/usecases/users/update-user-by-id'
import { Either, right } from '../../../../shared'
import { UserModel } from '../../../../domain/models/user-model'
import { UpdateUserController } from './update-user-by-id-controller'
import { HttpRequest } from '../../../protocols/http'

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

describe('UpdateUserController', () => {
  it('Should call UpdateUserUseCase with correct params', async () => {
    class UpdateUserUseCaseStub implements UpdateUserById {
      async execute(
        _userId: string,
        _params: UpdateUserById.Params
      ): Promise<Either<Error, UserModel>> {
        return right(makeUserModel())
      }
    }
    const updateUserUseCaseStub = new UpdateUserUseCaseStub()
    const sut = new UpdateUserController(updateUserUseCaseStub)
    const updateUserSpy = vi.spyOn(updateUserUseCaseStub, 'execute')
    await sut.handle(makeUpdateRequest())
    expect(updateUserSpy).toHaveBeenCalledWith(
      makeUpdateRequest().params.userId,
      makeUpdateRequest().body
    )
    expect(updateUserSpy).toHaveBeenCalledOnce()
  })
})
