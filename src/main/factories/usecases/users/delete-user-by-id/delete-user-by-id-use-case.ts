import { DeleteUserUseCase } from '@/data/usecases/users/delete-user/delete-user-use-case'
import { DeleteUserById } from '@/domain/usecases/users/delete-user-by-id'
import { UsersRepository } from '@/infra/database/postgres/users/users-postgres-repository'

export const makeDeleteUserByIdUseCase = (): DeleteUserById => {
  const usersRepository = new UsersRepository()
  return new DeleteUserUseCase(usersRepository, usersRepository)
}
