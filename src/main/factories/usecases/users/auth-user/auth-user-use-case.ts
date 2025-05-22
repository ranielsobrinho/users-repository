import { AuthenticateUseCase } from '@/data/usecases/auth/authenticate-use-case'
import { Authentication } from '@/domain/usecases/authentication/authentication'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { JwtAdapter } from '@/infra/criptography/jwt-adapter/jwt-adapter'
import { UsersRepository } from '@/infra/database/postgres/users/users-postgres-repository'

export const makeAuthenticateUseCase = (): Authentication => {
  const salt = process.env.JWT_SALT ?? 'knasdLKJASÃç12'
  const usersRepository = new UsersRepository()
  const tokenGenerator = new JwtAdapter(salt)
  const bcryptAdapter = new BcryptAdapter(12)
  return new AuthenticateUseCase(usersRepository, tokenGenerator, bcryptAdapter)
}
