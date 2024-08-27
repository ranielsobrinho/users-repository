import { NotFoundError } from '@/data/errors'
import { GetUserByEmailRepository } from '@/data/protocols/users/get-user-by-email-repository'
import { Authentication } from '@/domain/usecases/authentication/authentication'
import { Either, left, right } from '@/shared'

export class AuthenticateUseCase implements Authentication {
  constructor(
    private readonly getUserByEmailRepository: GetUserByEmailRepository
  ) {}
  async execute(
    params: Authentication.Params
  ): Promise<Either<Error, Authentication.Result>> {
    const userData = await this.getUserByEmailRepository.getByEmail(
      params.email
    )
    if (!userData) {
      return left(new NotFoundError())
    }
    return right('ok')
  }
}
