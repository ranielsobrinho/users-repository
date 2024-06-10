import { describe, expect, it, vi } from 'vitest'
import { DeleteUserById } from '../../../../domain/usecases/users/delete-user-by-id'
import { Either, left, right } from '../../../../shared'
import { NotFoundError } from '../../../errors/not-found-error'
import { serverError, notFound, noContent } from '../../../helpers/http-helper'
import { HttpRequest } from '../../../protocols/http'
import { DeleteUserByIdController } from './delete-user-by-id-controller'

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

  it('Should return 404 if DeleteUserByIdUseCase returns null', async () => {
    const { sut, deleteUserByIdUseCaseStub } = makeSut()
    vi.spyOn(deleteUserByIdUseCaseStub, 'execute').mockResolvedValueOnce(
      left(new NotFoundError())
    )
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(notFound(new NotFoundError()))
  })

  it('Should return 204 on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeHttpRequest())
    expect(httpResponse).toEqual(noContent())
  })
})
