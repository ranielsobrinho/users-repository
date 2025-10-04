import { describe, it, expect, vi, beforeEach } from 'vitest'
import { RabbitMQNotificationProducer } from './rabbitmq-notification-producer'
import RabbitMQConnection from '../rabbitmq'
import logger from '../../../../main/config/logger'

vi.mock('../rabbitmq')
vi.mock('../../../../main/config/logger')

describe('RabbitMQNotificationProducer', () => {
  const params = {
    email: 'test@example.com',
    name: 'Test User'
    // Add other fields as required by your Params interface
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('logs and sends email notification to RabbitMQ', async () => {
    const sendToQueueMock = vi
      .spyOn(RabbitMQConnection, 'sendToQueue')
      .mockResolvedValue(undefined)
    const loggerInfoMock = vi.spyOn(logger, 'info')

    const producer = new RabbitMQNotificationProducer()
    await producer.sendEmail(params)

    expect(loggerInfoMock).toHaveBeenCalledWith(
      `Sending message to notifications queue with: ${params}`
    )
    expect(sendToQueueMock).toHaveBeenCalledWith(
      'notifications',
      'send-email-notification',
      params
    )
  })
})
