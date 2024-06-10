import { describe, expect, it, vi } from 'vitest'
import { left, right } from '../../../../shared'
import { GetUserByEmailRepository } from '../../../protocols/users/get-user-by-email-repository'
import { CreateUserRepository } from '../../../protocols/users/create-user-repository'
import { EmailAlreadyInUseError, RequiredFieldError } from '../../../errors'
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
  it('Should returns left error if CreateUserUseCase received null params', async () => {
    const { sut } = makeSut()
    const user = await sut.execute({
      name: 'any_name',
      email: 'any_email',
      phone: undefined
    })
    expect(user).toEqual(left(new RequiredFieldError('phone')))
  })

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
      makeUserModel()
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

  it('Should return error if CreateUserRepository returns null', async () => {
    const { sut, createUserRepositoryStub } = makeSut()
    vi.spyOn(createUserRepositoryStub, 'createUser').mockResolvedValueOnce(null)
    const userData = await sut.execute(makeCreateUserRequest())
    expect(userData).toEqual(
      left(new EmailAlreadyInUseError(makeCreateUserRequest().email))
    )
  })

  it('Should throw if CreateUserRepository throws', async () => {
    const { sut, createUserRepositoryStub } = makeSut()
    vi.spyOn(createUserRepositoryStub, 'createUser').mockRejectedValueOnce(
      new Error()
    )
    const promise = sut.execute(makeCreateUserRequest())
    await expect(promise).rejects.toThrow(new Error())
  })

  it('Should return user data on success', async () => {
    const { sut } = makeSut()
    const userData = await sut.execute(makeCreateUserRequest())
    expect(userData).toEqual(right(makeUserModel()))
  })
})
