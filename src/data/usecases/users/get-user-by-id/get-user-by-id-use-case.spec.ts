import { describe, it, expect, vi } from 'vitest'
import { GetUserByIdRepository } from '../../../protocols/users/get-user-by-id-repository'
import { GetUserByIdUseCase } from './get-user-by-id-use-case'

const makeGetUserByIdRepositoryStub = (): GetUserByIdRepository => {
  class GetUserByIdRepositoryStub implements GetUserByIdRepository {
    async getById(_userId: string): Promise<GetUserByIdRepository.Result> {
      return null
    }
  }
  return new GetUserByIdRepositoryStub()
}

type SutTypes = {
  sut: GetUserByIdUseCase
  getUserByIdRepositoryStub: GetUserByIdRepository
}

const makeSut = (): SutTypes => {
  const getUserByIdRepositoryStub = makeGetUserByIdRepositoryStub()
  const sut = new GetUserByIdUseCase(getUserByIdRepositoryStub)
  return {
    sut,
    getUserByIdRepositoryStub
  }
}

describe('GetUserByIdUseCase', () => {
  it('Should call GetUserByIdRepository with correct param', async () => {
    const { sut, getUserByIdRepositoryStub } = makeSut()
    const getUserSpy = vi.spyOn(getUserByIdRepositoryStub, 'getById')
    await sut.execute('any_id')
    expect(getUserSpy).toHaveBeenCalledOnce()
    expect(getUserSpy).toHaveBeenCalledWith('any_id')
  })
})
