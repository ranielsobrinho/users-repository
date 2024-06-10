import { describe, it, expect, vi } from 'vitest'
import { GetUserById } from '../../../../domain/usecases/users/get-user-by-id'
import { Either, right } from '../../../../shared'
import { GetUserByIdController } from './get-user-by-id-controller'

describe('GetUserByIdController', () => {
  it('Should call GetUserByIdUseCase with correct param', async () => {
    class GetUserByIdUseCaseStub implements GetUserById {
      async execute(_userId: string): Promise<Either<Error, any>> {
        return right({
          id: 'any_id',
          name: 'any_name',
          email: 'any_email',
          phone: 'any_phone'
        })
      }
    }
    const getUserByIdUseCaseStub = new GetUserByIdUseCaseStub()
    const sut = new GetUserByIdController(getUserByIdUseCaseStub)
    const getByIdSpy = vi.spyOn(getUserByIdUseCaseStub, 'execute')
    await sut.handle({
      body: {
        userId: 'any_id'
      }
    })

    expect(getByIdSpy).toHaveBeenCalledOnce()
    expect(getByIdSpy).toHaveBeenCalledWith('any_id')
  })
})
