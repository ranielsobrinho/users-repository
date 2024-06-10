import { GetUserByEmailRepository } from '@/data/protocols/users/get-user-by-email-repository'
import { EmailAlreadyInUseError } from '@/data/errors/email-already-in-use-error'
import { CreateUser } from '@/domain/usecases/users/create-user'
import { Either, right, left } from '@/shared'
import { CreateUserRepository } from '@/data/protocols/users/create-user-repository'

export class CreateUserUseCase implements CreateUser {
  constructor(
    private readonly getUserByEmailRepository: GetUserByEmailRepository,
    private readonly createUserRepository: CreateUserRepository
  ) {}
  async execute(
    params: CreateUser.Params
  ): Promise<Either<Error, CreateUser.Result>> {
    const { email } = params
    const user = await this.getUserByEmailRepository.getByEmail(email)
    if (user) {
      return left(new EmailAlreadyInUseError(email))
    }
    const userCreated = await this.createUserRepository.createUser(params)
    return right(userCreated)
  }
}
