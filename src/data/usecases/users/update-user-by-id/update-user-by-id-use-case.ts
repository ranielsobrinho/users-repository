import { NotFoundError, RequiredFieldError } from '@/data/errors'
import { GetUserByIdRepository } from '@/data/protocols/users/get-user-by-id-repository'
import { UpdateUserByIdRepository } from '@/data/protocols/users/update-user-by-id-repository'
import { UpdateUserById } from '@/domain/usecases/users/update-user-by-id'
import { Either, left, right } from '@/shared'
import { validate } from '@/data/utils/validate-params'
import { logger } from '@/main/config/pino-logger'

const KEY = '[UpdateUserByIdUseCase]:'
export class UpdateUserByIdUseCase implements UpdateUserById {
  constructor(
    private readonly getUserByIdRepository: GetUserByIdRepository,
    private readonly updateUserByIdRepository: UpdateUserByIdRepository
  ) {}

  async execute(
    userId: string,
    params: UpdateUserById.Params
  ): Promise<Either<NotFoundError, UpdateUserById.Result>> {
    logger.info(`${KEY} Get user with id: ${userId}`)
    const user = await this.getUserByIdRepository.getById(userId)

    if (!user) {
      logger.error(`${KEY} User with id: ${userId} not found`)
      return left(new NotFoundError())
    }

    const validationError = await validate(params)
    if (validationError.length) {
      return left(new RequiredFieldError(validationError))
    }

    logger.info(`${KEY} Update user with id: ${userId} with params: ${params}`)
    const updatedData = await this.updateUserByIdRepository.update(
      userId,
      params
    )
    return right(updatedData)
  }
}
