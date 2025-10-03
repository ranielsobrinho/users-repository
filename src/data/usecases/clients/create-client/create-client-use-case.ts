import { EmailAlreadyInUseError, RequiredFieldError } from '@/data/errors'
import { CreateClientRepository } from '@/data/protocols/db/clients/create-client-repository'
import { GetClientByEmailRepository } from '@/data/protocols/db/clients/get-client-by-email-repository'
import { validate } from '@/data/utils/validate-params'
import { ClientModel } from '@/domain/models/client-model'
import { CreateClient } from '@/domain/usecases/clients/create-client'
import { Either, left, right } from '@/shared'

export class CreateClientUseCase implements CreateClient {
  constructor(
    private readonly getClientByEmailRepository: GetClientByEmailRepository,
    private readonly createClientRepository: CreateClientRepository
  ) {}

  async execute(
    params: CreateClient.Params
  ): Promise<Either<EmailAlreadyInUseError, ClientModel>> {
    const { email } = params
    const validationError = await validate(params)
    if (validationError.length) {
      return left(new RequiredFieldError(validationError))
    }

    const client = await this.getClientByEmailRepository.getByEmail(email)

    if (client) {
      return left(new EmailAlreadyInUseError(email))
    }

    const createdClient = await this.createClientRepository.createClient(params)

    if (createdClient) {
      return right(createdClient)
    }

    return left(new EmailAlreadyInUseError(email))
  }
}
