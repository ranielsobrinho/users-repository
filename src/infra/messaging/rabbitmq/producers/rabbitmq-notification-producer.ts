import { SendNewAccountEmailNotificationProtocol } from '@/data/protocols/messaging/email/new-account-notification-protocol'
import RabbitMQConnection from '@/infra/messaging/rabbitmq/rabbitmq'
import { logger } from '@/main/config/pino-logger'

const KEY = '[RabbitMQNotificationProducer]:'
export class RabbitMQNotificationProducer
  implements SendNewAccountEmailNotificationProtocol
{
  async sendEmail(
    params: SendNewAccountEmailNotificationProtocol.Params
  ): Promise<void> {
    logger.info(`${KEY} Sending message to notifications queue with: ${params}`)
    const queue = 'notifications'
    const pattern = 'send-email-notification'

    await RabbitMQConnection.sendToQueue(queue, pattern, params)
  }
}
