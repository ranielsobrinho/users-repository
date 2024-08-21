import { UpdateUserByIdUseCase } from '@/data/usecases/users/update-user-by-id/update-user-by-id-use-case'
import { UpdateUserById } from '@/domain/usecases/users/update-user-by-id'
import { UsersRepository } from '@/infra/database/postgres/users/users-postgres-repository'

export const makeUpdateUserByIdUseCase = (): UpdateUserById => {
  const usersRepository = new UsersRepository()
  return new UpdateUserByIdUseCase(
    usersRepository,
    usersRepository,
    usersRepository
  )
}
