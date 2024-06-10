import { GetUserByIdUseCase } from '@/data/usecases/users/get-user-by-id/get-user-by-id-use-case'
import { GetUserById } from '@/domain/usecases/users/get-user-by-id'
import { UsersRepository } from '@/infra/database/postgres/users/users-postgres-repository'

export const makeGetUserByIdUseCase = (): GetUserById => {
  const userRepository = new UsersRepository()
  return new GetUserByIdUseCase(userRepository)
}
