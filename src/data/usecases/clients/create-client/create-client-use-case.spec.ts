import { describe, expect, it, vi } from 'vitest'
import { GetClientByEmailRepository } from '../../../protocols/db/clients/get-client-by-email-repository'
import { CreateClientUseCase } from './create-client-use-case'

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

describe('CreateClientUseCase', () => {
  it('Should call GetClientByEmailRepository with correct param', async () => {
    class GetClientByEmailRepositoryStub implements GetClientByEmailRepository {
      async getByEmail(
        _email: string
      ): Promise<GetClientByEmailRepository.Result> {
        return makeClientModel()
      }
    }
    const getClientByEmailRepositoryStub = new GetClientByEmailRepositoryStub()
    const sut = new CreateClientUseCase(getClientByEmailRepositoryStub)
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
})
