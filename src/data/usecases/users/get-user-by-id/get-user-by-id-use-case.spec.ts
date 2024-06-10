import { describe, it, expect, vi } from 'vitest'
import { GetUserByIdRepository } from '../../../protocols/users/get-user-by-id-repository'
import { GetUserByIdUseCase } from './get-user-by-id-use-case'
import { UserModel } from '../../../../domain/models/user-model'
import { NotFoundError } from '../../../errors'
import { left, right } from '../../../../shared'

const makeUserModel = (): UserModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email',
  phone: 'any_phone'
})

const makeGetUserByIdRepositoryStub = (): GetUserByIdRepository => {
  class GetUserByIdRepositoryStub implements GetUserByIdRepository {
    async getById(_userId: string): Promise<GetUserByIdRepository.Result> {
      return makeUserModel()
    }
  }
  return new GetUserByIdRepositoryStub()
}

type SutTypes = {
  sut: GetUserByIdUseCase
  getUserByIdRepositoryStub: GetUserByIdRepository
}

const makeSut = (): SutTypes => {
  const getUserByIdRepositoryStub = makeGetUserByIdRepositoryStub()
  const sut = new GetUserByIdUseCase(getUserByIdRepositoryStub)
  return {
    sut,
    getUserByIdRepositoryStub
  }
}

describe('GetUserByIdUseCase', () => {
  it('Should call GetUserByIdRepository with correct param', async () => {
    const { sut, getUserByIdRepositoryStub } = makeSut()
    const getUserSpy = vi.spyOn(getUserByIdRepositoryStub, 'getById')
    await sut.execute('any_id')
    expect(getUserSpy).toHaveBeenCalledOnce()
    expect(getUserSpy).toHaveBeenCalledWith('any_id')
  })

  it('Should throw if GetUserByIdRepository throws', async () => {
    const { sut, getUserByIdRepositoryStub } = makeSut()
    vi.spyOn(getUserByIdRepositoryStub, 'getById').mockRejectedValueOnce(
      new Error()
    )
    const result = sut.execute('any_id')
    expect(result).rejects.toThrow(new Error())
  })

  it('Should return NotFoundError if GetUserByIdRepository returns null', async () => {
    const { sut, getUserByIdRepositoryStub } = makeSut()
    vi.spyOn(getUserByIdRepositoryStub, 'getById').mockResolvedValueOnce(null)
    const result = await sut.execute('any_id')
    expect(result).toEqual(left(new NotFoundError()))
  })

  it('Should return user on success', async () => {
    const { sut } = makeSut()
    const result = await sut.execute('any_id')
    expect(result).toEqual(right(makeUserModel()))
  })
})
