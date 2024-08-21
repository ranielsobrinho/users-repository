import { describe, it, vi, expect } from 'vitest'
import { GetUserByIdRepository } from '../../../protocols/users/get-user-by-id-repository'
import { UpdateUserByIdUseCase } from './update-user-by-id-use-case'
import { UserModel } from '../../../../domain/models/user-model'
import { left, right } from '../../../../shared'
import { NotFoundError, RequiredFieldError } from '../../../errors'
import { UpdateUserByIdRepository } from '../../../protocols/users/update-user-by-id-repository'
import { GetUserByEmailRepository } from '../../../protocols/users/get-user-by-email-repository'

const makeUserModel = (): UserModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email',
  phone: 'any_phone'
})

const makeUpdateUserModel = () => ({
  name: 'other_name',
  email: 'other_email',
  phone: 'other_phone'
})

const makeGetUserByIdRepositoryStub = (): GetUserByIdRepository => {
  class GetUserByIdRepositoryStub implements GetUserByIdRepository {
    async getById(_userId: string): Promise<GetUserByIdRepository.Result> {
      return makeUserModel()
    }
  }
  return new GetUserByIdRepositoryStub()
}

const makeUpdateUserByIdRepositoryStub = (): UpdateUserByIdRepository => {
  class UpdateUserByIdRepositoryStub implements UpdateUserByIdRepository {
    async update(
      _userId: string,
      _updateUserData: UpdateUserByIdRepository.Params
    ): Promise<UpdateUserByIdRepository.Result> {
      return {
        id: 'any_id',
        ...makeUpdateUserModel()
      }
    }
  }
  return new UpdateUserByIdRepositoryStub()
}

const makeGetUserByEmailRepositoryStub = (): GetUserByEmailRepository => {
  class GetUserByEmailRepositoryStub implements GetUserByEmailRepository {
    async getByEmail(_email: string): Promise<GetUserByEmailRepository.Result> {
      return null
    }
  }
  return new GetUserByEmailRepositoryStub()
}

type SutTypes = {
  sut: UpdateUserByIdUseCase
  getUserByIdRepositoryStub: GetUserByIdRepository
  updateUserByIdRepositoryStub: UpdateUserByIdRepository
  getUserByEmailRepositoryStub: GetUserByEmailRepository
}

const makeSut = (): SutTypes => {
  const getUserByIdRepositoryStub = makeGetUserByIdRepositoryStub()
  const updateUserByIdRepositoryStub = makeUpdateUserByIdRepositoryStub()
  const getUserByEmailRepositoryStub = makeGetUserByEmailRepositoryStub()
  const sut = new UpdateUserByIdUseCase(
    getUserByIdRepositoryStub,
    updateUserByIdRepositoryStub,
    getUserByEmailRepositoryStub
  )
  return {
    sut,
    getUserByIdRepositoryStub,
    updateUserByIdRepositoryStub,
    getUserByEmailRepositoryStub
  }
}

describe('UpdateUserByIdUseCase', () => {
  it('Should call GetUserByIdRepository with correct param', async () => {
    const { sut, getUserByIdRepositoryStub } = makeSut()
    const getUserByIdSpy = vi.spyOn(getUserByIdRepositoryStub, 'getById')
    await sut.execute('any_id', makeUpdateUserModel())
    expect(getUserByIdSpy).toHaveBeenCalledOnce()
    expect(getUserByIdSpy).toHaveBeenCalledWith('any_id')
  })

  it('Should throw if GetUserByIdRepository throws', async () => {
    const { sut, getUserByIdRepositoryStub } = makeSut()
    vi.spyOn(getUserByIdRepositoryStub, 'getById').mockRejectedValueOnce(
      new Error()
    )
    const promise = sut.execute('any_id', makeUpdateUserModel())
    expect(promise).rejects.toThrow(new Error())
  })

  it('Should return NotFoundError if GetUserByIdRepository returns null', async () => {
    const { sut, getUserByIdRepositoryStub } = makeSut()
    vi.spyOn(getUserByIdRepositoryStub, 'getById').mockResolvedValueOnce(null)
    const getUserByIdSpy = await sut.execute('any_id', makeUpdateUserModel())
    expect(getUserByIdSpy).toEqual(left(new NotFoundError()))
  })

  it('Should call UpdateUserByIdRepository with correct params', async () => {
    const { sut, updateUserByIdRepositoryStub } = makeSut()
    const updateUserSpy = vi.spyOn(updateUserByIdRepositoryStub, 'update')
    await sut.execute('any_id', makeUpdateUserModel())
    expect(updateUserSpy).toHaveBeenCalledTimes(1)
    expect(updateUserSpy).toHaveBeenCalledWith('any_id', makeUpdateUserModel())
  })

  it('Should throw if UpdateUserByIdRepository throws', async () => {
    const { sut, updateUserByIdRepositoryStub } = makeSut()
    vi.spyOn(updateUserByIdRepositoryStub, 'update').mockRejectedValueOnce(
      new Error()
    )
    const promise = sut.execute('any_id', makeUpdateUserModel())
    expect(promise).rejects.toThrow(new Error())
  })

  it('Should returns left error if UpdateUserByIdRepository received null params', async () => {
    const { sut } = makeSut()
    const user = await sut.execute('any_id', {
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
    await sut.execute('any_id', makeUpdateUserModel())
    expect(getUserByEmailSpy).toHaveBeenCalledOnce()
    expect(getUserByEmailSpy).toHaveBeenCalledWith(makeUpdateUserModel().email)
  })

  it('Should throw if GetUserByEmailRepository throws', async () => {
    const { sut, getUserByEmailRepositoryStub } = makeSut()
    vi.spyOn(getUserByEmailRepositoryStub, 'getByEmail').mockRejectedValueOnce(
      new Error()
    )
    const promise = sut.execute('any_id', makeUpdateUserModel())
    await expect(promise).rejects.toThrow(new Error())
  })

  it('Should return updated data on success', async () => {
    const { sut } = makeSut()
    const result = await sut.execute('any_id', makeUpdateUserModel())
    expect(result).toEqual(right({ id: 'any_id', ...makeUpdateUserModel() }))
  })
})
