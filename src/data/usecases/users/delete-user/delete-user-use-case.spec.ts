import { describe, vi, expect, it } from 'vitest'
import { GetUserByIdRepository } from '../../../protocols/users/get-user-by-id-repository'
import { DeleteUserUseCase } from './delete-user-use-case'
import { UserModel } from '../../../../domain/models/user-model'
import { left } from '../../../../shared'
import { NotFoundError } from '../../../errors'

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
  sut: DeleteUserUseCase
  getUserByIdRepositoryStub: GetUserByIdRepository
}

const makeSut = (): SutTypes => {
  const getUserByIdRepositoryStub = makeGetUserByIdRepositoryStub()
  const sut = new DeleteUserUseCase(getUserByIdRepositoryStub)
  return {
    sut,
    getUserByIdRepositoryStub
  }
}

describe('DeleteUserUseCase', () => {
  it('Should call GetUserByIdRepository with correct param', async () => {
    const { sut, getUserByIdRepositoryStub } = makeSut()
    const getByIdSpy = vi.spyOn(getUserByIdRepositoryStub, 'getById')
    await sut.execute('any_id')
    expect(getByIdSpy).toHaveBeenCalledOnce()
    expect(getByIdSpy).toHaveBeenCalledWith('any_id')
  })

  it('Should throw if GetUserByIdRepository throws', async () => {
    const { sut, getUserByIdRepositoryStub } = makeSut()
    vi.spyOn(getUserByIdRepositoryStub, 'getById').mockRejectedValueOnce(
      new Error()
    )
    const promise = sut.execute('any_id')
    expect(promise).rejects.toThrow()
  })

  it('Should return not found error if GetUserByIdRepository returns null', async () => {
    const { sut, getUserByIdRepositoryStub } = makeSut()
    vi.spyOn(getUserByIdRepositoryStub, 'getById').mockResolvedValueOnce(null)
    const response = await sut.execute('any_id')
    expect(response).toEqual(left(new NotFoundError()))
  })
})
