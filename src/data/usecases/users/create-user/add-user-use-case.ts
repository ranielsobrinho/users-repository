import { EmailAlreadyInUseError } from '@/data/errors/email-already-in-use-error'
import { RequiredFieldError } from '@/data/errors/required-field-error'
import { TokenGenerator } from '@/data/protocols/criptography/token-generator'
import { CreateUserRepository } from '@/data/protocols/users/create-user-repository'
import { GetUserByEmailRepository } from '@/data/protocols/users/get-user-by-email-repository'
import { validate } from '@/data/utils/validate-params'
import { CreateUser } from '@/domain/usecases/users/create-user'
import { Either, left, right } from '@/shared'

export class CreateUserUseCase implements CreateUser {
  constructor(
    private readonly getUserByEmailRepository: GetUserByEmailRepository,
    private readonly createUserRepository: CreateUserRepository,
    private readonly tokenGenerator: TokenGenerator
  ) {}
  async execute(
    params: CreateUser.Params
  ): Promise<
    Either<EmailAlreadyInUseError | RequiredFieldError, CreateUser.Result>
  > {
    const { email } = params

    const validationError = await validate(params)
    if (validationError.length) {
      return left(new RequiredFieldError(validationError))
    }

    const user = await this.getUserByEmailRepository.getByEmail(email)
    if (!user) {
      const userCreated = await this.createUserRepository.createUser(params)
      if (!userCreated) {
        return left(new EmailAlreadyInUseError(email))
      }
      const accessToken = await this.tokenGenerator.generate(userCreated.id)
      return right(accessToken)
    }
    return left(new EmailAlreadyInUseError(email))
  }
}
