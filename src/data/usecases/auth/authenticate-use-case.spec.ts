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

describe('AuthenticateUseCase', () => {
  it('Should call GetUserByEmailRepository with correct param', async () => {
    class LoadUserByEmailRepositoryStub implements GetUserByEmailRepository {
      async getByEmail(_email: string): Promise<any> {
        return makeUserModel()
      }
    }
    const loadUserByEmailRepositoryStub = new LoadUserByEmailRepositoryStub()
    const sut = new AuthenticateUseCase(loadUserByEmailRepositoryStub)
    const getUserSpy = vi.spyOn(loadUserByEmailRepositoryStub, 'getByEmail')
    await sut.execute(makeUserRequest())
    expect(getUserSpy).toHaveBeenCalledWith(makeUserRequest().email)
  })
})
