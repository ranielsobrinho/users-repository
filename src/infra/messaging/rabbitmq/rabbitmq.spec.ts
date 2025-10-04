import { describe, it, beforeEach, vi, expect } from 'vitest'
import RabbitMQConnection from './rabbitmq'
import logger from '../../../main/config/logger'
import { connect as amqpConnect } from 'amqplib'

vi.mock('amqplib')
vi.mock('../../../main/config/logger')

const mockChannel = {
  assertQueue: vi.fn(),
  sendToQueue: vi.fn()
}
const mockConnection = {
  createChannel: vi.fn().mockResolvedValue(mockChannel)
}

describe('RabbitMQConnection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.AQMP_CONNECTION = 'amqp://localhost'
    ;(amqpConnect as unknown as ReturnType<typeof vi.fn>).mockResolvedValue(
      mockConnection
    )
  })

  it('connects to RabbitMQ and creates a channel', async () => {
    await RabbitMQConnection.connect()
    expect(amqpConnect).toHaveBeenCalledWith('amqp://localhost')
    expect(mockConnection.createChannel).toHaveBeenCalled()
    expect(logger.info).toHaveBeenCalledWith('Connecting to Rabbit-MQ Server')
    expect(logger.info).toHaveBeenCalledWith('✅ RabbitMQ Connection is ready')
  })

  it('throws if AQMP_CONNECTION is not set', async () => {
    process.env.AQMP_CONNECTION = ''
    const exitSpy = vi.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit')
    })
    await expect(RabbitMQConnection.connect()).rejects.toThrow('process.exit')
    exitSpy.mockRestore()
  })

  it('sends a message to the queue', async () => {
    await RabbitMQConnection.sendToQueue('test-queue', 'test-pattern', {
      foo: 'bar'
    })
    expect(mockChannel.assertQueue).toHaveBeenCalledWith('test-queue', {
      durable: true
    })
    expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
      'test-queue',
      Buffer.from(
        JSON.stringify({
          pattern: 'test-pattern',
          data: { message: { foo: 'bar' } }
        })
      )
    )
  })
})
