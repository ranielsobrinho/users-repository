import { describe, it, expect, vi } from 'vitest'
import { GetUserByIdRepository } from '../../../protocols/users/get-user-by-id-repository'
import { GetUserByIdUseCase } from './get-user-by-id-use-case'

describe('GetUserByIdUseCase', () => {
  it('Should call GetUserByIdRepository with correct param', async () => {
    class GetUserByIdRepositoryStub implements GetUserByIdRepository {
      async getById(_userId: string): Promise<GetUserByIdRepository.Result> {
        return null
      }
    }
    const getUserByIdRepositoryStub = new GetUserByIdRepositoryStub()
    const sut = new GetUserByIdUseCase(getUserByIdRepositoryStub)
    const getUserSpy = vi.spyOn(getUserByIdRepositoryStub, 'getById')
    await sut.execute('any_id')
    expect(getUserSpy).toHaveBeenCalledOnce()
    expect(getUserSpy).toHaveBeenCalledWith('any_id')
  })
})
