import { describe, expect, it, vi } from 'vitest'
import { Either, left, right } from '../../../shared'
import { GetUserByEmailRepository } from '../../protocols/users/get-user-by-email-repository'
import { EmailAlreadyInUseError } from '../../errors/email-already-in-use-error'
import { CreateUserUseCase } from './add-user-use-case'

const makeCreateUserRequest = () => ({
  name: 'any_name',
  email: 'any_email',
  phone: 'any_phone'
})

const makeUserModel = () => ({
  id: 'any_id',
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

  it('Should throw if GetUserByEmailRepository throws', async () => {
    const { sut, getUserByEmailRepositoryStub } = makeSut()
    vi.spyOn(getUserByEmailRepositoryStub, 'getByEmail').mockRejectedValueOnce(
      new Error()
    )
    const promise = sut.execute(makeCreateUserRequest())
    await expect(promise).rejects.toThrow(new Error())
  })

  it('Should returns left error if GetUserByEmailRepository returns a user', async () => {
    const { sut, getUserByEmailRepositoryStub } = makeSut()
    vi.spyOn(getUserByEmailRepositoryStub, 'getByEmail').mockResolvedValueOnce(
      right(makeUserModel())
    )
    const user = await sut.execute(makeCreateUserRequest())
    expect(user).toEqual(
      left(new EmailAlreadyInUseError(makeCreateUserRequest().email))
    )
  })
})
