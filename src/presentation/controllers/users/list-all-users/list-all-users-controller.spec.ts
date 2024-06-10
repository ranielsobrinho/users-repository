import { describe, vi, expect, it } from 'vitest'
import { ListAllUsers } from '../../../../domain/usecases/users/list-all-users'
import { Either, right } from '../../../../shared'
import { ListAllUsersController } from './list-all-users-controller'

describe('ListAllUsersController', () => {
  it('Should call ListAllUsersUseCase once', async () => {
    class ListAllUsersUseCaseStub implements ListAllUsers {
      async execute(): Promise<Either<Error, ListAllUsers.Result>> {
        return right([
          {
            id: 'any_id',
            name: 'any_name',
            email: 'any_email',
            phone: 'any_phone'
          }
        ])
      }
    }
    const listAllUsersUseCaseStub = new ListAllUsersUseCaseStub()
    const sut = new ListAllUsersController(listAllUsersUseCaseStub)
    const listUsersSpy = vi.spyOn(listAllUsersUseCaseStub, 'execute')
    await sut.handle({})
    expect(listUsersSpy).toHaveBeenCalledOnce()
  })
})
