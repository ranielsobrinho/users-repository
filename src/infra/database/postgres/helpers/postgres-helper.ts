import { Client } from 'pg'

const DB_CONNECTION_STRING: string =
  process.env.DB_CONNECTION_STRING ||
  'postgresql://postgres:95751535r@localhost:5432/postgres'

class PostgresHelper {
  async connect(): Promise<void> {
    const client = new Client({ connectionString: DB_CONNECTION_STRING })
    client
      .connect()
      .then(() => console.log('Postgres connected !'))
      .catch((err) => console.error('Error when connecting to postgres!', err))
  }

  async getClient(): Promise<Client> {
    const client = new Client({ connectionString: DB_CONNECTION_STRING })
    await client.connect()
    return client
  }

  async disconnect(): Promise<void> {
    const client = new Client({ connectionString: DB_CONNECTION_STRING })
    client.end()
  }
}

export default new PostgresHelper()
