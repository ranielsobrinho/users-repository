import { Pool } from 'pg'

const DB_HOST: string = process.env.DB_HOST!
const DB_USER: string = process.env.DB_USER!
const DB_PASSWORD: string = process.env.DB_PASSWORD!
const DB_NAME: string = process.env.DB_NAME!
const DB_PORT: number = Number(process.env.DB_PORT!)

class PostgresHelper {
  private client = new Pool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    port: DB_PORT
  })

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
