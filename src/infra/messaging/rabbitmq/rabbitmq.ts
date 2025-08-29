import { Channel, connect, ChannelModel } from 'amqplib'
import { logger } from '@/main/config/pino-logger'

const KEY = '[RabbitMQConnection]:'
class RabbitMQConnection {
  connection!: ChannelModel
  channel!: Channel
  private connected!: boolean

  async connect(): Promise<void> {
    const AQMP_CONNECTION = process.env.AQMP_CONNECTION
    if (!AQMP_CONNECTION) {
      logger.warn(`${KEY} AQMP_CONNECTION MUST BE CONFIGURED`)
      process.exit(1)
    }

    if (this.connected && this.channel) return
    else this.connected = true

    try {
      logger.info(`${KEY} Connecting to Rabbit-MQ Server`)
      this.connection = await connect(AQMP_CONNECTION)

      logger.info(`${KEY} ✅ RabbitMQ Connection is ready`)

      this.channel = await this.connection.createChannel()
    } catch (error) {
      logger.error(`${KEY} ${error}`)
      logger.error(`${KEY} 🚫 Not connected to MQ Server`)
      throw error
    }
  }

  async sendToQueue(
    queue: string,
    pattern: string,
    message: any
  ): Promise<void> {
    try {
      if (!this.channel) {
        await this.connect()
      }

      await this.channel.assertQueue(queue, { durable: true })

      this.channel.sendToQueue(
        queue,
        Buffer.from(
          JSON.stringify({
            pattern,
            data: { message }
          })
        )
      )
    } catch (error) {
      logger.error(`${KEY} ${error}`)
      throw error
    }
  }
}

export default new RabbitMQConnection()
