import { CreateUserUseCase } from '@/data/usecases/users/create-user/add-user-use-case'
import { CreateUser } from '@/domain/usecases/users/create-user'
import { UsersRepository } from '@/infra/database/postgres/users/users-postgres-repository'

export const makeCreateUserUseCase = (): CreateUser => {
  const usersRepository = new UsersRepository()
  return new CreateUserUseCase(usersRepository, usersRepository)
}
