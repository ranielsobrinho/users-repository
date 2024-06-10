import { GetUserByIdRepository } from '@/data/protocols/users/get-user-by-id-repository'
import { GetUserById } from '@/domain/usecases/users/get-user-by-id'
import { Either, right } from '@/shared'

export class GetUserByIdUseCase implements GetUserById {
  constructor(private readonly getUserByIdRepository: GetUserByIdRepository) {}
  async execute(userId: string): Promise<Either<Error, GetUserById.Result>> {
    await this.getUserByIdRepository.getById(userId)
    return right(null)
  }
}
