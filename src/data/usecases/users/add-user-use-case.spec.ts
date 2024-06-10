import { describe, expect, it, vi } from 'vitest'
import { Either, left, right } from '../../../shared'
import { GetUserByEmailRepository } from '../../protocols/users/get-user-by-email-repository'
import { CreateUserRepository } from '../../protocols/users/create-user-repository'
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
    async getByEmail(_email: string): Promise<GetUserByEmailRepository.Result> {
      return null
    }
  }
  return new GetUserByEmailRepositoryStub()
}

const makeCreateUserRepositoryStub = (): CreateUserRepository => {
  class CreateUserRepositoryStub implements CreateUserRepository {
    async createUser(
      _params: CreateUserRepository.Params
    ): Promise<CreateUserRepository.Result> {
      return makeUserModel()
    }
  }
  return new CreateUserRepositoryStub()
}

type SutTypes = {
  sut: CreateUserUseCase
  getUserByEmailRepositoryStub: GetUserByEmailRepository
  createUserRepositoryStub: CreateUserRepository
}

const makeSut = (): SutTypes => {
  const getUserByEmailRepositoryStub = makeGetUserByEmailRepositoryStub()
  const createUserRepositoryStub = makeCreateUserRepositoryStub()
  const sut = new CreateUserUseCase(
    getUserByEmailRepositoryStub,
    createUserRepositoryStub
  )
  return {
    sut,
    getUserByEmailRepositoryStub,
    createUserRepositoryStub
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
    expect(getUserByEmailSpy).toHaveBeenCalledOnce()
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

  it('Should call CreateUserRepository with correct params', async () => {
    const { sut, createUserRepositoryStub } = makeSut()
    const createUserSpy = vi.spyOn(createUserRepositoryStub, 'createUser')
    await sut.execute(makeCreateUserRequest())
    expect(createUserSpy).toHaveBeenCalledOnce()
    expect(createUserSpy).toHaveBeenCalledWith(makeCreateUserRequest())
  })
})
