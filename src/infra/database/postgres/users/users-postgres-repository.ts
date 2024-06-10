import { CreateUserRepository } from '@/data/protocols/users/create-user-repository'
import { GetUserByEmailRepository } from '@/data/protocols/users/get-user-by-email-repository'
import DatabaseHelper from '@/infra/database/postgres/helpers/postgres-helper'

export class UsersRepository
  implements GetUserByEmailRepository, CreateUserRepository
{
  async createUser(
    params: CreateUserRepository.Params
  ): Promise<CreateUserRepository.Result> {
    const client = await DatabaseHelper.getClient()
    const result = await client.query(
      'INSERT INTO seucarlos.users(name, email, phone) VALUES ($1, $2, $3) RETURNING *',
      [params.name, params.email, params.phone]
    )
    return result.rows[0] ?? null
  }

  async getByEmail(email: string): Promise<GetUserByEmailRepository.Result> {
    const client = await DatabaseHelper.getClient()
    const result = await client.query(
      'SELECT * FROM seucarlos.users WHERE email = $1',
      [email]
    )
    return result.rows[0] ?? null
  }
}
