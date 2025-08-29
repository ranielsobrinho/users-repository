import { GetUserByIdRepository } from '@/data/protocols/users/get-user-by-id-repository'
import { DeleteUserById } from '@/domain/usecases/users/delete-user-by-id'
import { Either, right, left } from '@/shared'
import { NotFoundError } from '@/data/errors/not-found-error'
import { DeleteUserRepository } from '@/data/protocols/users/delete-user-repository'
import { logger } from '@/main/config/pino-logger'

const KEY = '[DeleteUserUseCase]:'
export class DeleteUserUseCase implements DeleteUserById {
  constructor(
    private readonly getUserByIdRepository: GetUserByIdRepository,
    private readonly deleteUserRepository: DeleteUserRepository
  ) {}

  async execute(userId: string): Promise<Either<Error, DeleteUserById.Result>> {
    logger.info(`${KEY} Get user with id: ${userId}`)
    const user = await this.getUserByIdRepository.getById(userId)

    if (!user) {
      logger.error(`${KEY} User with id: ${userId} not found`)
      return left(new NotFoundError())
    }

    logger.info(`${KEY} Delete user with id: ${userId}`)
    const deletedUser = await this.deleteUserRepository.deleteById(userId)

    return right(deletedUser)
  }
}
