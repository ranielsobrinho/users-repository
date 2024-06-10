import { GetUserByEmailRepository } from '@/data/protocols/users/get-user-by-email-repository'
import { EmailAlreadyInUseError } from '@/data/errors/email-already-in-use-error'
import { CreateUser } from '@/domain/usecases/users/create-user'
import { Either, right, left } from '@/shared'

export class CreateUserUseCase implements CreateUser {
  constructor(
    private readonly getUserByEmailRepository: GetUserByEmailRepository
  ) {}
  async execute(
    params: CreateUser.Params
  ): Promise<Either<Error, CreateUser.Result>> {
    const { email } = params
    const user = await this.getUserByEmailRepository.getByEmail(email)
    if (user) {
      return left(new EmailAlreadyInUseError(email))
    }
    return right({ id: 'any_id' })
  }
}
