import { NotFoundError } from '@/data/errors'
import { GetUserByIdRepository } from '@/data/protocols/users/get-user-by-id-repository'
import { UpdateUserByIdRepository } from '@/data/protocols/users/update-user-by-id-repository'
import { UpdateUserById } from '@/domain/usecases/users/update-user-by-id'
import { Either, left, right } from '@/shared'

export class UpdateUserByIdUseCase implements UpdateUserById {
  constructor(
    private readonly getUserByIdRepository: GetUserByIdRepository,
    private readonly updateUserByIdRepository: UpdateUserByIdRepository
  ) {}

  async execute(
    userId: string,
    params: UpdateUserById.Params
  ): Promise<Either<NotFoundError, UpdateUserById.Result>> {
    const user = await this.getUserByIdRepository.getById(userId)

    if (!user) {
      return left(new NotFoundError())
    }

    const updatedData = await this.updateUserByIdRepository.update(
      userId,
      params
    )
    return right(updatedData)
  }
}
