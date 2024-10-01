import { CreateUserUseCase } from '@/data/usecases/users/create-user/add-user-use-case'
import { CreateUser } from '@/domain/usecases/users/create-user'
import { JwtAdapter } from '@/infra/criptography/jwt-adapter/jwt-adapter'
import { UsersRepository } from '@/infra/database/postgres/users/users-postgres-repository'

export const makeCreateUserUseCase = (): CreateUser => {
  const salt = process.env.JWT_SALT || 'knasdLKJASÃç12'
  const usersRepository = new UsersRepository()
  const tokenGenerator = new JwtAdapter(salt)
  return new CreateUserUseCase(usersRepository, usersRepository, tokenGenerator)
}
