import { describe, it, vi, expect } from 'vitest'
import { GetUserByEmailRepository } from '../../protocols/users/get-user-by-email-repository'
import { UserModel } from '../../../domain/models/user-model'
import { AuthenticateUseCase } from './authenticate-use-case'
import { left, right } from '../../../shared'
import { NotFoundError, IncorrectPasswordError } from '../../errors'
import { TokenGenerator } from '../../protocols/criptography/token-generator'
import { HashComparer } from '../../protocols/criptography/hash-comparer'

const makeUserModel = (): UserModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email',
  phone: 'any_phone',
  password: 'hashed_password'
})

const makeUserRequest = () => ({
  email: 'any_email',
  password: 'any_password'
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

const makeHashComparerStub = (): HashComparer => {
  class HashComparerStub implements HashComparer {
    async compare(_value: string, _hash: string): Promise<boolean> {
      return true
    }
  }
  return new HashComparerStub()
}
type SutTypes = {
  sut: AuthenticateUseCase
  loadUserByEmailRepositoryStub: GetUserByEmailRepository
  tokenGeneratorStub: TokenGenerator
  hashComparerStub: HashComparer
}

const makeSut = (): SutTypes => {
  const loadUserByEmailRepositoryStub = makeLoadUserByEmailRepositoryStub()
  const tokenGeneratorStub = makeTokenGeneratorStub()
  const hashComparerStub = makeHashComparerStub()
  const sut = new AuthenticateUseCase(
    loadUserByEmailRepositoryStub,
    tokenGeneratorStub,
    hashComparerStub
  )
  return {
    sut,
    loadUserByEmailRepositoryStub,
    tokenGeneratorStub,
    hashComparerStub
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

  it('Should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    vi.spyOn(tokenGeneratorStub, 'generate').mockRejectedValueOnce(new Error())
    const promise = sut.execute(makeUserRequest())
    expect(promise).rejects.toThrow(new Error())
  })

  it('Should call HashComparer with correct param', async () => {
    const { sut, hashComparerStub } = makeSut()
    const generateTokenSpy = vi.spyOn(hashComparerStub, 'compare')
    await sut.execute(makeUserRequest())
    expect(generateTokenSpy).toHaveBeenCalledWith(
      makeUserRequest().password,
      makeUserModel().password
    )
  })

  it('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut()
    vi.spyOn(hashComparerStub, 'compare').mockRejectedValueOnce(new Error())
    const promise = sut.execute(makeUserRequest())
    expect(promise).rejects.toThrow(new Error())
  })

  it('Should return left error if HashComparer returns false', async () => {
    const { sut, hashComparerStub } = makeSut()
    vi.spyOn(hashComparerStub, 'compare').mockResolvedValueOnce(false)
    const response = await sut.execute(makeUserRequest())
    expect(response).toEqual(left(new IncorrectPasswordError()))
  })

  it('Should return access token on success', async () => {
    const { sut } = makeSut()
    const response = await sut.execute(makeUserRequest())
    expect(response).toEqual(right('any_token'))
  })
})
