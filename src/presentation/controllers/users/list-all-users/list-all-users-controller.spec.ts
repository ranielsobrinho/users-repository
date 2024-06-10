import { describe, vi, expect, it } from 'vitest'
import { ListAllUsers } from '../../../../domain/usecases/users/list-all-users'
import { Either, right } from '../../../../shared'
import { ListAllUsersController } from './list-all-users-controller'
import { noContent, ok, serverError } from '../../../helpers/http-helper'

const makeListAllUsersResult = () => {
  return [
    {
      id: 'any_id',
      name: 'any_name',
      email: 'any_email',
      phone: 'any_phone'
    }
  ]
}

const makeListAllUsersUseCaseStub = (): ListAllUsers => {
  class ListAllUsersUseCaseStub implements ListAllUsers {
    async execute(): Promise<Either<Error, ListAllUsers.Result>> {
      return right(makeListAllUsersResult())
    }
  }
  return new ListAllUsersUseCaseStub()
}

type SutTypes = {
  sut: ListAllUsersController
  listAllUsersUseCaseStub: ListAllUsers
}

const makeSut = (): SutTypes => {
  const listAllUsersUseCaseStub = makeListAllUsersUseCaseStub()
  const sut = new ListAllUsersController(listAllUsersUseCaseStub)
  return {
    sut,
    listAllUsersUseCaseStub
  }
}

describe('ListAllUsersController', () => {
  it('Should call ListAllUsersUseCase once', async () => {
    const { sut, listAllUsersUseCaseStub } = makeSut()
    const listUsersSpy = vi.spyOn(listAllUsersUseCaseStub, 'execute')
    await sut.handle({})
    expect(listUsersSpy).toHaveBeenCalledOnce()
  })

  it('Should return 500 if ListAllUsersUseCase throws', async () => {
    const { sut, listAllUsersUseCaseStub } = makeSut()
    vi.spyOn(listAllUsersUseCaseStub, 'execute').mockRejectedValueOnce(
      new Error()
    )
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 204 if ListAllUsersUseCase returns empty', async () => {
    const { sut, listAllUsersUseCaseStub } = makeSut()
    vi.spyOn(listAllUsersUseCaseStub, 'execute').mockResolvedValueOnce(
      right([])
    )
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(noContent())
  })

  it('Should return 200 if ListAllUsersUseCase returns empty', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(ok(makeListAllUsersResult()))
  })
})
