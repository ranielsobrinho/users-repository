import { GetUserByIdRepository } from '@/data/protocols/users/get-user-by-id-repository'
import { GetUserById } from '@/domain/usecases/users/get-user-by-id'
import { Either, right, left } from '@/shared'
import { NotFoundError } from '@/data/errors'
import { logger } from '@/main/config/pino-logger'

const KEY = '[GetUserByIdUseCase]:'
export class GetUserByIdUseCase implements GetUserById {
  constructor(private readonly getUserByIdRepository: GetUserByIdRepository) {}
  async execute(
    userId: string
  ): Promise<Either<NotFoundError, GetUserById.Result>> {
    logger.info(`${KEY} Get user with id: ${userId}`)
    const user = await this.getUserByIdRepository.getById(userId)
    if (!user) {
      logger.error(`${KEY} User with id: ${userId} not found`)
      return left(new NotFoundError())
    }
    return right(user)
  }
}
