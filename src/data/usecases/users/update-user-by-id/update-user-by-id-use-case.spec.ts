import { describe, it, vi, expect } from 'vitest'
import { GetUserByIdRepository } from '../../../protocols/users/get-user-by-id-repository'
import { UpdateUserByIdUseCase } from './update-user-by-id-use-case'

describe('UpdateUserByIdUseCase', () => {
  it('Should call GetUserByIdRepository with correct param', async () => {
    class GetUserByIdRepositoryStub implements GetUserByIdRepository {
      async getById(_userId: string): Promise<GetUserByIdRepository.Result> {
        return {
          id: 'any_id',
          name: 'any_name',
          email: 'any_email',
          phone: 'any_phone'
        }
      }
    }
    const getUserByIdRepositoryStub = new GetUserByIdRepositoryStub()
    const sut = new UpdateUserByIdUseCase(getUserByIdRepositoryStub)
    const getUserByIdSpy = vi.spyOn(getUserByIdRepositoryStub, 'getById')
    await sut.execute('any_id', {
      name: 'other_name',
      email: 'other_email',
      phone: 'other_phone'
    })
    expect(getUserByIdSpy).toHaveBeenCalledOnce()
    expect(getUserByIdSpy).toHaveBeenCalledWith('any_id')
  })
})
