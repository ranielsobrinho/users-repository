import { Client } from 'pg'

const DB_CONNECTION_STRING: string = process.env.DB_CONNECTION_STRING!

class PostgresHelper {
  private client = new Client({ connectionString: DB_CONNECTION_STRING })

  async connect(): Promise<void> {
    this.client
      .connect()
      .then(() => console.log('Postgres connected !'))
      .catch((err) => console.error('Error when connecting to postgres!', err))
  }

  async getClient(): Promise<Client> {
    await this.client.connect()
    return this.client
  }

  async disconnect(): Promise<void> {
    this.client.end()
  }
}

export default new PostgresHelper()
