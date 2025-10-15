import { randomUUID } from 'node:crypto'
import { CreateClientRepository } from '@/data/protocols/db/clients/create-client-repository'
import DatabaseHelper from '@/infra/database/postgres/helpers/postgres-helper'

export class ClientsRepository implements CreateClientRepository {
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
}
