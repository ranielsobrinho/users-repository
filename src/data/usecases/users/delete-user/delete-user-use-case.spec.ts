import { describe, vi, expect, it } from 'vitest'
import { GetUserByIdRepository } from '../../../protocols/users/get-user-by-id-repository'
import { DeleteUserRepository } from '../../../protocols/users/delete-user-repository'
import { DeleteUserUseCase } from './delete-user-use-case'
import { UserModel } from '../../../../domain/models/user-model'
import { left, right } from '../../../../shared'
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

const makeDeleteUserRepositoryStub = (): DeleteUserRepository => {
  class DeleteUserRepositoryStub implements DeleteUserRepository {
    async deleteById(_userId: string): Promise<DeleteUserRepository.Result> {
      return makeUserModel()
    }
  }
  return new DeleteUserRepositoryStub()
}

type SutTypes = {
  sut: DeleteUserUseCase
  getUserByIdRepositoryStub: GetUserByIdRepository
  deleteUserRepositoryStub: DeleteUserRepository
}

const makeSut = (): SutTypes => {
  const getUserByIdRepositoryStub = makeGetUserByIdRepositoryStub()
  const deleteUserRepositoryStub = makeDeleteUserRepositoryStub()
  const sut = new DeleteUserUseCase(
    getUserByIdRepositoryStub,
    deleteUserRepositoryStub
  )
  return {
    sut,
    getUserByIdRepositoryStub,
    deleteUserRepositoryStub
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

  it('Should call DeleteUserRepository with correct param', async () => {
    const { sut, deleteUserRepositoryStub } = makeSut()
    const deleteUserSpy = vi.spyOn(deleteUserRepositoryStub, 'deleteById')
    await sut.execute('any_id')
    expect(deleteUserSpy).toHaveBeenCalledOnce()
    expect(deleteUserSpy).toHaveBeenCalledWith('any_id')
  })

  it('Should throw if DeleteUserRepository throws', async () => {
    const { sut, deleteUserRepositoryStub } = makeSut()
    vi.spyOn(deleteUserRepositoryStub, 'deleteById').mockRejectedValueOnce(
      new Error()
    )
    const promise = sut.execute('any_id')
    expect(promise).rejects.toThrow()
  })

  it('Should return deleted user on success', async () => {
    const { sut } = makeSut()
    const response = await sut.execute('any_id')
    expect(response).toEqual(right(makeUserModel()))
  })
})
