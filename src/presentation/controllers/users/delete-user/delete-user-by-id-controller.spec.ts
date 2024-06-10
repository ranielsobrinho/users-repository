import { DeleteUserById } from '../../../../domain/usecases/users/delete-user-by-id'
import { Either, right } from '../../../../shared'
import { describe, it, vi, expect } from 'vitest'
import { DeleteUserByIdController } from './delete-user-by-id-controller'
import { HttpRequest } from '../../../protocols/http'
import { serverError } from '../../../helpers/http-helper'

const makeHttpRequest = (): HttpRequest => ({
  body: { userId: 'any_id' }
})

const makeDeleteUserByIdUseCaseStub = (): DeleteUserById => {
  class DeleteUserByIdUseCaseStub implements DeleteUserById {
    async execute(
      _userId: string
    ): Promise<Either<Error, DeleteUserById.Result>> {
      return right({
        id: 'any_id',
        name: 'any_name',
        email: 'any_email',
        phone: 'any_phone'
      })
    }
  }
  return new DeleteUserByIdUseCaseStub()
}

type SutTypes = {
  sut: DeleteUserByIdController
  deleteUserByIdUseCaseStub: DeleteUserById
}

const makeSut = (): SutTypes => {
  const deleteUserByIdUseCaseStub = makeDeleteUserByIdUseCaseStub()
  const sut = new DeleteUserByIdController(deleteUserByIdUseCaseStub)
  return {
    sut,
    deleteUserByIdUseCaseStub
  }
}

describe('DeleteUserByIdController', () => {
  it('Should call DeleteUserByIdUseCase with correct param', async () => {
    const { sut, deleteUserByIdUseCaseStub } = makeSut()
    const deleteUserSpy = vi.spyOn(deleteUserByIdUseCaseStub, 'execute')
    await sut.handle(makeHttpRequest())
    expect(deleteUserSpy).toHaveBeenCalledOnce()
    expect(deleteUserSpy).toHaveBeenCalledWith('any_id')
  })

  it('Should return 500 if DeleteUserByIdUseCase throws', async () => {
    const { sut, deleteUserByIdUseCaseStub } = makeSut()
    vi.spyOn(deleteUserByIdUseCaseStub, 'execute').mockRejectedValueOnce(
      new Error()
    )
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
