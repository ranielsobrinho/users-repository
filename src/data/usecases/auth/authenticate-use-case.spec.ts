import { describe, it, vi, expect } from 'vitest'
import { GetUserByEmailRepository } from '../../protocols/users/get-user-by-email-repository'
import { UserModel } from '../../../domain/models/user-model'
import { AuthenticateUseCase } from './authenticate-use-case'
import { left } from '../../../shared'
import { NotFoundError } from '../../errors'
import { TokenGenerator } from '../../protocols/criptography/token-generator'

const makeUserModel = (): UserModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email',
  phone: 'any_phone'
})

const makeUserRequest = () => ({
  email: 'any_email',
  phone: 'any_phone'
})

const makeLoadUserByEmailRepositoryStub = (): GetUserByEmailRepository => {
  class LoadUserByEmailRepositoryStub implements GetUserByEmailRepository {
    async getByEmail(_email: string): Promise<GetUserByEmailRepository.Result> {
      return makeUserModel()
    }
  }
  return new LoadUserByEmailRepositoryStub()
}

const makeTokenGeneratorStub = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate(
      _param: TokenGenerator.Param
    ): Promise<TokenGenerator.Result> {
      return 'any_token'
    }
  }
  return new TokenGeneratorStub()
}

type SutTypes = {
  sut: AuthenticateUseCase
  loadUserByEmailRepositoryStub: GetUserByEmailRepository
  tokenGeneratorStub: TokenGenerator
}

const makeSut = (): SutTypes => {
  const loadUserByEmailRepositoryStub = makeLoadUserByEmailRepositoryStub()
  const tokenGeneratorStub = makeTokenGeneratorStub()
  const sut = new AuthenticateUseCase(
    loadUserByEmailRepositoryStub,
    tokenGeneratorStub
  )
  return {
    sut,
    loadUserByEmailRepositoryStub,
    tokenGeneratorStub
  }
}

describe('AuthenticateUseCase', () => {
  it('Should call GetUserByEmailRepository with correct param', async () => {
    const { sut, loadUserByEmailRepositoryStub } = makeSut()
    const getUserSpy = vi.spyOn(loadUserByEmailRepositoryStub, 'getByEmail')
    await sut.execute(makeUserRequest())
    expect(getUserSpy).toHaveBeenCalledWith(makeUserRequest().email)
  })

  it('Should throw if GetUserByEmailRepository throws', async () => {
    const { sut, loadUserByEmailRepositoryStub } = makeSut()
    vi.spyOn(loadUserByEmailRepositoryStub, 'getByEmail').mockRejectedValueOnce(
      new Error()
    )
    const promise = sut.execute(makeUserRequest())
    expect(promise).rejects.toThrow(new Error())
  })

  it('Should return left error if GetUserByEmailRepository returns null', async () => {
    const { sut, loadUserByEmailRepositoryStub } = makeSut()
    vi.spyOn(loadUserByEmailRepositoryStub, 'getByEmail').mockResolvedValueOnce(
      null
    )
    const response = await sut.execute(makeUserRequest())
    expect(response).toEqual(left(new NotFoundError()))
  })

  it('Should call TokenGenerator with correct param', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const generateTokenSpy = vi.spyOn(tokenGeneratorStub, 'generate')
    await sut.execute(makeUserRequest())
    expect(generateTokenSpy).toHaveBeenCalledWith(makeUserModel().id)
  })
})
