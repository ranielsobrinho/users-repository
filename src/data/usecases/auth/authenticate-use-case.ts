import { NotFoundError } from '@/data/errors'
import { IncorrectPasswordError } from '@/data/errors/password-error'
import { HashComparer } from '@/data/protocols/criptography/hash-comparer'
import { TokenGenerator } from '@/data/protocols/criptography/token-generator'
import { GetUserByEmailRepository } from '@/data/protocols/users/get-user-by-email-repository'
import { Authentication } from '@/domain/usecases/authentication/authentication'
import { logger } from '@/main/config/pino-logger'
import { Either, left, right } from '@/shared'

const KEY = '[AuthenticateUseCase]: '
export class AuthenticateUseCase implements Authentication {
  constructor(
    private readonly getUserByEmailRepository: GetUserByEmailRepository,
    private readonly tokenGenerator: TokenGenerator,
    private readonly hashComparer: HashComparer
  ) {}
  async execute(
    params: Authentication.Params
  ): Promise<Either<Error, Authentication.Result>> {
    logger.info(`${KEY} Get user with email: ${params.email}`)
    const userData = await this.getUserByEmailRepository.getByEmail(
      params.email
    )
    if (userData) {
      logger.info(`${KEY} Checking if password is valid`)
      const isValid = await this.hashComparer.compare(
        params.password,
        userData.password
      )
      if (!isValid) {
        logger.error(`${KEY} Incorrect password`)
        return left(new IncorrectPasswordError())
      }
      logger.info(`${KEY} Generating access token`)
      const accessToken = await this.tokenGenerator.generate(userData.id)
      return right(accessToken)
    }

    logger.error(`${KEY} User with email ${params.email} not found`)
    return left(new NotFoundError())
  }
}
