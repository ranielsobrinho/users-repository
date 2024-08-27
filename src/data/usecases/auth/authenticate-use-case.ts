import { GetUserByEmailRepository } from '@/data/protocols/users/get-user-by-email-repository'
import {
  Authentication,
  AuthenticationModel
} from '@/domain/usecases/authentication/authentication'
import { Either, right } from '@/shared'

export class AuthenticateUseCase implements Authentication {
  constructor(
    private readonly getUserByEmailRepository: GetUserByEmailRepository
  ) {}
  async execute(
    params: Authentication.Params
  ): Promise<Either<Error, Authentication.Result>> {
    await this.getUserByEmailRepository.getByEmail(params.email)
    return right('ok')
  }
}
