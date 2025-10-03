import { describe, expect, it, vi } from 'vitest'
import { GetClientByEmailRepository } from '../../../protocols/db/clients/get-client-by-email-repository'
import { CreateClientRepository } from '../../../protocols/db/clients/create-client-repository'
import { CreateClientUseCase } from './create-client-use-case'
import { left } from '../../../../shared'
import { EmailAlreadyInUseError, RequiredFieldError } from '../../../errors'

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

const makeCreateClientRepositoryStub = (): CreateClientRepository => {
  class CreateClientRepositoryStub implements CreateClientRepository {
    async createClient(_params: CreateClientRepository.Params): Promise<any> {
      return makeClientModel()
    }
  }

  return new CreateClientRepositoryStub()
}

type SutTypes = {
  sut: CreateClientUseCase
  getClientByEmailRepositoryStub: GetClientByEmailRepository
  createClientRepositoryStub: CreateClientRepository
}

const makeSut = (): SutTypes => {
  const getClientByEmailRepositoryStub = makeGetClientByEmailRepositoryStub()
  const createClientRepositoryStub = makeCreateClientRepositoryStub()
  const sut = new CreateClientUseCase(
    getClientByEmailRepositoryStub,
    createClientRepositoryStub
  )
  return {
    sut,
    getClientByEmailRepositoryStub,
    createClientRepositoryStub
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

  it('Should throw if GetClientByEmailRepository throws', async () => {
    const { sut, getClientByEmailRepositoryStub } = makeSut()
    vi.spyOn(
      getClientByEmailRepositoryStub,
      'getByEmail'
    ).mockRejectedValueOnce(new Error())
    const promise = sut.execute(makeCreateClientRequest())
    await expect(promise).rejects.toThrow(new Error())
  })

  it('Should return left error if GetClientByEmailRepository returns a client', async () => {
    const { sut } = makeSut()
    const client = await sut.execute(makeCreateClientRequest())
    expect(client).toEqual(
      left(new EmailAlreadyInUseError(makeCreateClientRequest().email))
    )
  })

  it('Should call CreateClientRepository with correct param', async () => {
    const { sut, createClientRepositoryStub, getClientByEmailRepositoryStub } =
      makeSut()
    vi.spyOn(
      getClientByEmailRepositoryStub,
      'getByEmail'
    ).mockResolvedValueOnce(null)

    const createClientSpy = vi.spyOn(createClientRepositoryStub, 'createClient')
    await sut.execute(makeCreateClientRequest())
    expect(createClientSpy).toHaveBeenCalledOnce()
    expect(createClientSpy).toHaveBeenCalledWith(makeCreateClientRequest())
  })
})
