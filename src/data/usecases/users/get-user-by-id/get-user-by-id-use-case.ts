import { GetUserByIdRepository } from '@/data/protocols/users/get-user-by-id-repository'
import { GetUserById } from '@/domain/usecases/users/get-user-by-id'
import { Either, right, left } from '@/shared'
import { NotFoundError } from '@/data/errors'

export class GetUserByIdUseCase implements GetUserById {
  constructor(private readonly getUserByIdRepository: GetUserByIdRepository) {}
  async execute(
    userId: string
  ): Promise<Either<NotFoundError, GetUserById.Result>> {
    const user = await this.getUserByIdRepository.getById(userId)
    if (!user) {
      return left(new NotFoundError())
    }
    return right(user)
  }
}
