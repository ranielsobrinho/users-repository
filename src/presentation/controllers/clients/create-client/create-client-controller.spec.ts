import { describe, expect, it, vi } from 'vitest'
import { Either, left, right } from '../../../../shared'
import { HttpRequest } from '../../../protocols/http'
import { badRequest, ok, serverError } from '../../../helpers/http-helper'
import { CreateClient } from '../../../../domain/usecases/clients/create-client'
import { ClientModel } from '../../../../domain/models/client-model'
import { CreateClientController } from './create-client-controller'

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
describe('CreateClientController', () => {
  it('should call CreateClientUseCase with correct params', async () => {
    class CreateClientUseCaseStub implements CreateClient {
      async execute(
        _params: CreateClient.Params
      ): Promise<Either<Error, ClientModel>> {
        return right(makeCreateClientResult())
      }
    }
    const createClientUseCaseStub = new CreateClientUseCaseStub()
    const sut = new CreateClientController(createClientUseCaseStub)
    const createClientSpy = vi.spyOn(createClientUseCaseStub, 'execute')
    await sut.handle(makeCreateClientRequest())
    expect(createClientSpy).toHaveBeenCalledOnce()
    expect(createClientSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      phone: '1234567890'
    })
  })
})
