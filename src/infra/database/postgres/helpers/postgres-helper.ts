import { Pool } from 'pg'

const DB_CONNECTION_STRING: string = process.env.DB_CONNECTION_STRING!

class PostgresHelper {
  private client = new Pool({ connectionString: DB_CONNECTION_STRING })

  async connect(): Promise<void> {
    this.client
      .connect()
      .then(() => console.log('Postgres connected !'))
      .catch((err) => console.error('Error when connecting to postgres!', err))
  }

  async getClient(): Promise<Pool> {
    await this.client.connect()
    return this.client
  }

  async disconnect(): Promise<void> {
    this.client.end()
  }
}

export default new PostgresHelper()
