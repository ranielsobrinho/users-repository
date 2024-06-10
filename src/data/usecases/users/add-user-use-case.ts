import { GetUserByEmailRepository } from '@/data/protocols/users/get-user-by-email-repository'
import { CreateUser } from '@/domain/usecases/users/create-user'
import { Either, right } from '@/shared'

export class CreateUserUseCase implements CreateUser {
  constructor(
    private readonly getUserByEmailRepository: GetUserByEmailRepository
  ) {}
  async execute(
    params: CreateUser.Params
  ): Promise<Either<Error, CreateUser.Result>> {
    const { email } = params
    await this.getUserByEmailRepository.getByEmail(email)
    return right({ id: 'any_id' })
  }
}
