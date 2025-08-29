import { ListAllUsersRepository } from '@/data/protocols/users/list-all-users-repository'
import { ListAllUsers } from '@/domain/usecases/users/list-all-users'
import { Either, right } from '@/shared'
import { logger } from '@/main/config/pino-logger'
import { trace } from '@opentelemetry/api'

const KEY = '[ListAllUsersUseCase]:'
export class ListAllUsersUseCase implements ListAllUsers {
  constructor(
    private readonly listAllUsersRepository: ListAllUsersRepository
  ) {}

  async execute(): Promise<Either<Error, ListAllUsers.Result>> {
    logger.info(`${KEY} Get all users`)
    const tracer = trace.getTracer('list-all-tracer')
    const span = tracer.startSpan('list-all-span')

    const users = await this.listAllUsersRepository.listAll()
    span.setAttribute('test', 'hello world')
    span.end()
    return right(users)
  }
}
