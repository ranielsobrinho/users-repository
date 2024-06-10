import { describe, it, vi, expect } from 'vitest'
import { ListAllUsersRepository } from '../../../protocols/users/list-all-users-repository'
import { ListAllUsersUseCase } from './list-all-users-use-case'

const makeListAllUsersRepositoryStub = (): ListAllUsersRepository => {
  class ListAllUsersRepositoryStub implements ListAllUsersRepository {
    async listAll(): Promise<ListAllUsersRepository.Result> {
      return [
        {
          id: 'any_id',
          name: 'any_name',
          email: 'any_email@mail.com',
          phone: '9789743413'
        }
      ]
    }
  }
  return new ListAllUsersRepositoryStub()
}

type SutTypes = {
  sut: ListAllUsersUseCase
  listAllUsersRepositoryStub: ListAllUsersRepository
}

const makeSut = (): SutTypes => {
  const listAllUsersRepositoryStub = makeListAllUsersRepositoryStub()
  const sut = new ListAllUsersUseCase(listAllUsersRepositoryStub)
  return {
    sut,
    listAllUsersRepositoryStub
  }
}

describe('ListAllUsersUseCase', () => {
  it('Should call ListAllUsersRepository once', async () => {
    const { sut, listAllUsersRepositoryStub } = makeSut()
    const listAllSpy = vi.spyOn(listAllUsersRepositoryStub, 'listAll')
    await sut.execute()
    expect(listAllSpy).toHaveBeenCalledOnce()
  })

  it('Should throw if ListAllUsersRepository throws', async () => {
    const { sut, listAllUsersRepositoryStub } = makeSut()
    vi.spyOn(listAllUsersRepositoryStub, 'listAll').mockRejectedValueOnce(
      new Error()
    )
    const promise = sut.execute()
    expect(promise).rejects.toThrow(new Error())
  })
})
