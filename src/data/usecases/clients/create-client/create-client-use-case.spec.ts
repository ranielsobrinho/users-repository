import { describe, expect, it, vi } from 'vitest'
import { GetClientByEmailRepository } from '../../../protocols/db/clients/get-client-by-email-repository'
import { CreateClientUseCase } from './create-client-use-case'
import { left } from '../../../../shared'
import { RequiredFieldError } from '../../../errors'

const makeCreateClientRequest = () => ({
  name: 'any_name',
  email: 'any_email',
  phone: 'any_phone'
})

const makeClientModel = () => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email',
  phone: 'any_phone',
  createdAt: new Date()
})

const makeGetClientByEmailRepositoryStub = (): GetClientByEmailRepository => {
  class GetClientByEmailRepositoryStub implements GetClientByEmailRepository {
    async getByEmail(
      _email: string
    ): Promise<GetClientByEmailRepository.Result> {
      return makeClientModel()
    }
  }
  return new GetClientByEmailRepositoryStub()
}

type SutTypes = {
  sut: CreateClientUseCase
  getClientByEmailRepositoryStub: GetClientByEmailRepository
}

const makeSut = (): SutTypes => {
  const getClientByEmailRepositoryStub = makeGetClientByEmailRepositoryStub()
  const sut = new CreateClientUseCase(getClientByEmailRepositoryStub)
  return {
    sut,
    getClientByEmailRepositoryStub
  }
}

describe('CreateClientUseCase', () => {
  it('Should call GetClientByEmailRepository with correct param', async () => {
    const { sut, getClientByEmailRepositoryStub } = makeSut()
    const getClientByEmailSpy = vi.spyOn(
      getClientByEmailRepositoryStub,
      'getByEmail'
    )
    await sut.execute(makeCreateClientRequest())
    expect(getClientByEmailSpy).toHaveBeenCalledOnce()
    expect(getClientByEmailSpy).toHaveBeenCalledWith(
      makeCreateClientRequest().email
    )
  })

  it('Should return left error if CreateClientUseCase received null params', async () => {
    const { sut } = makeSut()
    const client = await sut.execute({
      name: 'any_name',
      email: undefined,
      phone: 'any_phone'
    })
    expect(client).toEqual(left(new RequiredFieldError('email')))
  })
})
