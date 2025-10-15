import { randomUUID } from 'node:crypto'
import { CreateClientRepository } from '@/data/protocols/db/clients/create-client-repository'
import DatabaseHelper from '@/infra/database/postgres/helpers/postgres-helper'
import { GetClientByEmailRepository } from '@/data/protocols/db/clients/get-client-by-email-repository'

export class ClientsRepository
  implements CreateClientRepository, GetClientByEmailRepository
{
  async createClient(
    params: CreateClientRepository.Params
  ): Promise<CreateClientRepository.Result> {
    const client = await DatabaseHelper.getClient()
    const result = await client.query(
      'INSERT INTO clients(id, name, email, phone) VALUES ($1, $2, $3, $4) RETURNING *',
      [randomUUID(), params.name, params.email, params.phone]
    )

    return result.rows[0] ?? null
  }

  async getByEmail(email: string): Promise<GetClientByEmailRepository.Result> {
    const client = await DatabaseHelper.getClient()
    const result = await client.query(
      'SELECT id, name, email, phone FROM clients WHERE email = $1',
      [email]
    )
    return result.rows[0] ?? null
  }
}
