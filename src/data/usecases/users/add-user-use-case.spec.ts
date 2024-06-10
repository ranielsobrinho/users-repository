import { describe, expect, it, vi } from 'vitest'
import { Either, right } from '../../../shared'
import { GetUserByEmailRepository } from '../../protocols/users/get-user-by-email-repository'
import { CreateUserUseCase } from './add-user-use-case'

describe('CreateUserUseCase', () => {
  it('Should call GetUserByEmailRepository with correct param', async () => {
    class GetUserByEmailRepositoryStub implements GetUserByEmailRepository {
      async getByEmail(
        _email: string
      ): Promise<Either<Error, GetUserByEmailRepository.Result>> {
        return right(null)
      }
    }
    const getUserByEmailRepositoryStub = new GetUserByEmailRepositoryStub()
    const sut = new CreateUserUseCase(getUserByEmailRepositoryStub)
    const getUserByEmailSpy = vi.spyOn(
      getUserByEmailRepositoryStub,
      'getByEmail'
    )
    await sut.execute({
      name: 'any_name',
      email: 'any_email',
      phone: 'any_phone'
    })
    expect(getUserByEmailSpy).toHaveBeenCalled()
    expect(getUserByEmailSpy).toHaveBeenCalledWith('any_email')
  })
})
