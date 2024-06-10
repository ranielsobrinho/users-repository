import { DeleteUserById } from '../../../../domain/usecases/users/delete-user-by-id'
import { Either, right } from '../../../../shared'
import { describe, it, vi, expect } from 'vitest'
import { DeleteUserByIdController } from './delete-user-by-id-controller'

describe('DeleteUserByIdController', () => {
  it('Should call DeleteUserByIdUseCase with correct param', async () => {
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
    const deleteUserByIdUseCaseStub = new DeleteUserByIdUseCaseStub()
    const sut = new DeleteUserByIdController(deleteUserByIdUseCaseStub)
    const deleteUserSpy = vi.spyOn(deleteUserByIdUseCaseStub, 'execute')
    await sut.handle({ body: { userId: 'any_id' } })
    expect(deleteUserSpy).toHaveBeenCalledOnce()
    expect(deleteUserSpy).toHaveBeenCalledWith('any_id')
  })
})
