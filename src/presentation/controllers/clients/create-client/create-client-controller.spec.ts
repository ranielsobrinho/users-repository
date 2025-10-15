import { describe, expect, it, vi } from 'vitest'
import { Either, left, right } from '../../../../shared'
import { HttpRequest } from '../../../protocols/http'
import { badRequest, ok, serverError } from '../../../helpers/http-helper'
import { CreateClient } from '../../../../domain/usecases/clients/create-client'
import { ClientModel } from '../../../../domain/models/client-model'
import { CreateClientController } from './create-client-controller'

class EmailAlreadyInUseError extends Error {
  constructor(email: string) {
    super(`Email ${email} already in use.`)
    this.name = 'EmailAlreadyInUseError'
  }
}

const makeCreateClientResult = (): ClientModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  phone: '1234567890',
  created_at: new Date()
})

const makeCreateClientRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    phone: '1234567890'
  }
})

const makeCreateClientUseCaseStub = (): CreateClient => {
  class CreateClientUseCaseStub implements CreateClient {
    async execute(
      _params: CreateClient.Params
    ): Promise<Either<Error, ClientModel>> {
      return right(makeCreateClientResult())
    }
  }
  return new CreateClientUseCaseStub()
}

type SutTypes = {
  sut: CreateClientController
  createClientUseCaseStub: CreateClient
}

const makeSut = (): SutTypes => {
  const createClientUseCaseStub = makeCreateClientUseCaseStub()
  const sut = new CreateClientController(createClientUseCaseStub)
  return { sut, createClientUseCaseStub }
}

describe('CreateClientController', () => {
  it('should call CreateClientUseCase with correct params', async () => {
    const { sut, createClientUseCaseStub } = makeSut()
    const createClientSpy = vi.spyOn(createClientUseCaseStub, 'execute')
    await sut.handle(makeCreateClientRequest())
    expect(createClientSpy).toHaveBeenCalledOnce()
    expect(createClientSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      phone: '1234567890'
    })
  })

  it('Should return 500 if CreateClient throws', async () => {
    const { sut, createClientUseCaseStub } = makeSut()
    vi.spyOn(createClientUseCaseStub, 'execute').mockRejectedValueOnce(
      new Error()
    )
    const httpResponse = await sut.handle(makeCreateClientRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  it('Should return 400 if CreateClient returns a EmailAlreadyInUse error', async () => {
    const { sut, createClientUseCaseStub } = makeSut()
    vi.spyOn(createClientUseCaseStub, 'execute').mockResolvedValueOnce(
      left(new EmailAlreadyInUseError(makeCreateClientRequest().body.email))
    )
    const httpResponse = await sut.handle(makeCreateClientRequest())
    expect(httpResponse).toEqual(
      badRequest(
        new EmailAlreadyInUseError(makeCreateClientRequest().body.email)
      )
    )
  })
})
