import { EmailAlreadyInUseError } from '@/data/errors/email-already-in-use-error'
import { RequiredFieldError } from '@/data/errors/required-field-error'
import { CreateUserRepository } from '@/data/protocols/users/create-user-repository'
import { GetUserByEmailRepository } from '@/data/protocols/users/get-user-by-email-repository'
import { CreateUser } from '@/domain/usecases/users/create-user'
import { Either, left, right } from '@/shared'

export class CreateUserUseCase implements CreateUser {
  constructor(
    private readonly getUserByEmailRepository: GetUserByEmailRepository,
    private readonly createUserRepository: CreateUserRepository
  ) {}
  async execute(
    params: CreateUser.Params
  ): Promise<
    Either<EmailAlreadyInUseError | RequiredFieldError, CreateUser.Result>
  > {
    const { email } = params

    const validationError = await this.validate(params)
    if (validationError.length) {
      return left(new RequiredFieldError(validationError))
    }

    const user = await this.getUserByEmailRepository.getByEmail(email)
    if (!user) {
      const userCreated = await this.createUserRepository.createUser(params)
      if (!userCreated) {
        return left(new EmailAlreadyInUseError(email))
      }
      return right(userCreated)
    }
    return left(new EmailAlreadyInUseError(email))
  }

  async validate(params: any): Promise<string> {
    let paramError = ''
    Object.values(params).forEach((param, index) => {
      if (param === null || param === '' || param === undefined) {
        paramError = Object.keys(params)[index]
      }
    })
    return paramError
  }
}
