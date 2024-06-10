import { NotFoundError } from '@/data/errors'
import { GetUserByIdRepository } from '@/data/protocols/users/get-user-by-id-repository'
import { UpdateUserById } from '@/domain/usecases/users/update-user-by-id'
import { Either, right } from '@/shared'

export class UpdateUserByIdUseCase implements UpdateUserById {
  constructor(private readonly getUserByIdRepository: GetUserByIdRepository) {}

  async execute(
    userId: string,
    params: UpdateUserById.Params
  ): Promise<Either<NotFoundError, UpdateUserById.Result>> {
    await this.getUserByIdRepository.getById(userId)
    return right({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email',
      phone: 'any_phone'
    })
  }
}
