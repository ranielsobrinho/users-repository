import { describe, vi, expect, it } from 'vitest'
import { GetUserByIdRepository } from '../../../protocols/users/get-user-by-id-repository'
import { DeleteUserUseCase } from './delete-user-use-case'

describe('DeleteUserUseCase', () => {
  it('Should call GetUserByIdRepository with correct param', async () => {
    class GetUserByIdRepositoryStub implements GetUserByIdRepository {
      async getById(userId: string): Promise<GetUserByIdRepository.Result> {
        return {
          id: 'any_id',
          name: 'any_name',
          email: 'any_email',
          phone: 'any_phone'
        }
      }
    }
    const getUserByIdRepositoryStub = new GetUserByIdRepositoryStub()
    const sut = new DeleteUserUseCase(getUserByIdRepositoryStub)
    const getByIdSpy = vi.spyOn(getUserByIdRepositoryStub, 'getById')
    await sut.execute('any_id')
    expect(getByIdSpy).toHaveBeenCalledOnce()
    expect(getByIdSpy).toHaveBeenCalledWith('any_id')
  })
})
