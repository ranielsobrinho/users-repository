import { CreateUserRepository } from '@/data/protocols/users/create-user-repository'
import { GetUserByEmailRepository } from '@/data/protocols/users/get-user-by-email-repository'
import { GetUserByIdRepository } from '@/data/protocols/users/get-user-by-id-repository'
import { ListAllUsersRepository } from '@/data/protocols/users/list-all-users-repository'
import { DeleteUserRepository } from '@/data/protocols/users/delete-user-repository'
import DatabaseHelper from '@/infra/database/postgres/helpers/postgres-helper'
import { UpdateUserByIdRepository } from '@/data/protocols/users/update-user-by-id-repository'

export class UsersRepository
  implements
    GetUserByEmailRepository,
    CreateUserRepository,
    ListAllUsersRepository,
    GetUserByIdRepository,
    DeleteUserRepository,
    UpdateUserByIdRepository
{
  async createUser(
    params: CreateUserRepository.Params
  ): Promise<CreateUserRepository.Result> {
    const client = await DatabaseHelper.getClient()
    const result = await client.query(
      'INSERT INTO seucarlos.users(name, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING *',
      [params.name, params.email, params.phone, params.password]
    )

    return result.rows[0] ?? null
  }

  async getByEmail(email: string): Promise<GetUserByEmailRepository.Result> {
    const client = await DatabaseHelper.getClient()
    const result = await client.query(
      'SELECT name, email, phone FROM seucarlos.users WHERE email = $1',
      [email]
    )
    return result.rows[0] ?? null
  }

  async listAll(): Promise<ListAllUsersRepository.Result> {
    const client = await DatabaseHelper.getClient()
    const result = await client.query(
      'SELECT name, email, phone, created_at FROM seucarlos.users'
    )
    return result.rows
  }

  async getById(userId: string): Promise<GetUserByIdRepository.Result> {
    const client = await DatabaseHelper.getClient()
    const result = await client.query(
      'SELECT name, email, phone, created_at FROM seucarlos.users WHERE seucarlos.users.id = $1',
      [userId]
    )
    return result.rows[0] ?? null
  }

  async deleteById(userId: string): Promise<DeleteUserRepository.Result> {
    const client = await DatabaseHelper.getClient()
    const result = await client.query(
      'DELETE FROM seucarlos.users WHERE seucarlos.users.id = $1',
      [userId]
    )
    return result.rows[0]
  }

  async update(
    userId: string,
    updateUserData: UpdateUserByIdRepository.Params
  ): Promise<UpdateUserByIdRepository.Result> {
    const client = await DatabaseHelper.getClient()
    const result = await client.query(
      'UPDATE seucarlos.users SET name = $1, email = $2, phone = $3 WHERE id = $4 RETURNING *',
      [updateUserData.name, updateUserData.email, updateUserData.phone, userId]
    )
    return result.rows[0]
  }
}
