import { EmailAlreadyInUseError, RequiredFieldError } from '@/data/errors'
import { GetClientByEmailRepository } from '@/data/protocols/db/clients/get-client-by-email-repository'
import { validate } from '@/data/utils/validate-params'
import { ClientModel } from '@/domain/models/client-model'
import { CreateClient } from '@/domain/usecases/clients/create-client'
import { Either, left, right } from '@/shared'

export class CreateClientUseCase implements CreateClient {
  constructor(
    private readonly getClientByEmailRepository: GetClientByEmailRepository
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

    return right({
      email: 'test',
      id: '1',
      name: 'lajd',
      phone: '231414214',
      created_at: new Date()
    })
  }
}
