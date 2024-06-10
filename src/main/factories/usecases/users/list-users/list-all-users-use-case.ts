import { ListAllUsersUseCase } from '@/data/usecases/users/list-all-users/list-all-users-use-case'
import { ListAllUsers } from '@/domain/usecases/users/list-all-users'
import { UsersRepository } from '@/infra/database/postgres/users/users-postgres-repository'

export const makeListAllUsersUseCase = (): ListAllUsers => {
  const usersRepository = new UsersRepository()
  return new ListAllUsersUseCase(usersRepository)
}
