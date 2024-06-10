import { GetUserByIdRepository } from '@/data/protocols/users/get-user-by-id-repository'
import { DeleteUserById } from '@/domain/usecases/users/delete-user-by-id'
import { Either, right, left } from '@/shared'
import { NotFoundError } from '@/data/errors/not-found-error'

export class DeleteUserUseCase implements DeleteUserById {
  constructor(private readonly getUserByIdRepository: GetUserByIdRepository) {}
  async execute(userId: string): Promise<Either<Error, DeleteUserById.Result>> {
    const user = await this.getUserByIdRepository.getById(userId)

    if (!user) {
      return left(new NotFoundError())
    }

    return right({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email',
      phone: 'any_phone'
    })
  }
}
