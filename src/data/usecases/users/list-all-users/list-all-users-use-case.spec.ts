import { describe, it, vi, expect } from 'vitest'
import { ListAllUsersRepository } from '../../../protocols/users/list-all-users-repository'
import { ListAllUsersUseCase } from './list-all-users-use-case'

describe('ListAllUsersUseCase', () => {
  it('Should call ListAllUsersRepository once', async () => {
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
    const listAllUsersRepository = new ListAllUsersRepositoryStub()
    const sut = new ListAllUsersUseCase(listAllUsersRepository)
    const listAllSpy = vi.spyOn(listAllUsersRepository, 'listAll')
    await sut.execute()
    expect(listAllSpy).toHaveBeenCalledOnce()
  })
})
