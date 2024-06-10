import { GetUserByIdRepository } from '@/data/protocols/users/get-user-by-id-repository'
import { DeleteUserById } from '@/domain/usecases/users/delete-user-by-id'
import { Either, right } from '@/shared'

export class DeleteUserUseCase implements DeleteUserById {
  constructor(private readonly getUserByIdRepository: GetUserByIdRepository) {}
  async execute(userId: string): Promise<Either<Error, DeleteUserById.Result>> {
    await this.getUserByIdRepository.getById(userId)
    return right({
      id: 'any_id',
      name: 'any_name',
      email: 'any_email',
      phone: 'any_phone'
    })
  }
}
