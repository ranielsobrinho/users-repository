import { describe, expect, it, vi } from 'vitest'
import { Either, right } from '../../../shared'
import { GetUserByEmailRepository } from '../../protocols/users/get-user-by-email-repository'
import { CreateUserUseCase } from './add-user-use-case'

const makeCreateUserRequest = () => ({
  name: 'any_name',
  email: 'any_email',
  phone: 'any_phone'
})

const makeGetUserByEmailRepositoryStub = (): GetUserByEmailRepository => {
  class GetUserByEmailRepositoryStub implements GetUserByEmailRepository {
    async getByEmail(
      _email: string
    ): Promise<Either<Error, GetUserByEmailRepository.Result>> {
      return right(null)
    }
  }
  return new GetUserByEmailRepositoryStub()
}

type SutTypes = {
  sut: CreateUserUseCase
  getUserByEmailRepositoryStub: GetUserByEmailRepository
}

const makeSut = (): SutTypes => {
  const getUserByEmailRepositoryStub = makeGetUserByEmailRepositoryStub()
  const sut = new CreateUserUseCase(getUserByEmailRepositoryStub)
  return {
    sut,
    getUserByEmailRepositoryStub
  }
}

describe('CreateUserUseCase', () => {
  it('Should call GetUserByEmailRepository with correct param', async () => {
    const { sut, getUserByEmailRepositoryStub } = makeSut()
    const getUserByEmailSpy = vi.spyOn(
      getUserByEmailRepositoryStub,
      'getByEmail'
    )
    await sut.execute(makeCreateUserRequest())
    expect(getUserByEmailSpy).toHaveBeenCalled()
    expect(getUserByEmailSpy).toHaveBeenCalledWith(
      makeCreateUserRequest().email
    )
  })
})
