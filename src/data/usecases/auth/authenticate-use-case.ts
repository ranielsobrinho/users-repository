import { NotFoundError } from '@/data/errors'
import { TokenGenerator } from '@/data/protocols/criptography/token-generator'
import { GetUserByEmailRepository } from '@/data/protocols/users/get-user-by-email-repository'
import { Authentication } from '@/domain/usecases/authentication/authentication'
import { Either, left, right } from '@/shared'

export class AuthenticateUseCase implements Authentication {
  constructor(
    private readonly getUserByEmailRepository: GetUserByEmailRepository,
    private readonly tokenGenerator: TokenGenerator
  ) {}
  async execute(
    params: Authentication.Params
  ): Promise<Either<Error, Authentication.Result>> {
    const userData = await this.getUserByEmailRepository.getByEmail(
      params.email
    )
    if (userData) {
      await this.tokenGenerator.generate(userData.id)
    }
    return left(new NotFoundError())
  }
}
