import { describe, it, vi, expect } from 'vitest'
import { GetUserByEmailRepository } from '../../protocols/users/get-user-by-email-repository'
import { UserModel } from '../../../domain/models/user-model'
import { AuthenticateUseCase } from './authenticate-use-case'

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
    async getByEmail(_email: string): Promise<any> {
      return makeUserModel()
    }
  }
  return new LoadUserByEmailRepositoryStub()
}

type SutTypes = {
  sut: AuthenticateUseCase
  loadUserByEmailRepositoryStub: GetUserByEmailRepository
}

const makeSut = (): SutTypes => {
  const loadUserByEmailRepositoryStub = makeLoadUserByEmailRepositoryStub()
  const sut = new AuthenticateUseCase(loadUserByEmailRepositoryStub)
  return {
    sut,
    loadUserByEmailRepositoryStub
  }
}

describe('AuthenticateUseCase', () => {
  it('Should call GetUserByEmailRepository with correct param', async () => {
    const { sut, loadUserByEmailRepositoryStub } = makeSut()
    const getUserSpy = vi.spyOn(loadUserByEmailRepositoryStub, 'getByEmail')
    await sut.execute(makeUserRequest())
    expect(getUserSpy).toHaveBeenCalledWith(makeUserRequest().email)
  })
})
