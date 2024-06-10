import { ListAllUsersRepository } from '@/data/protocols/users/list-all-users-repository'
import { ListAllUsers } from '@/domain/usecases/users/list-all-users'
import { Either, right } from '@/shared'

export class ListAllUsersUseCase implements ListAllUsers {
  constructor(
    private readonly listAllUsersRepository: ListAllUsersRepository
  ) {}

  async execute(): Promise<Either<Error, ListAllUsers.Result>> {
    await this.listAllUsersRepository.listAll()
    return right([])
  }
}
