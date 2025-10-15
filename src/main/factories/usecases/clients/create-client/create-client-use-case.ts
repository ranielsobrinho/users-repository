import { CreateClientUseCase } from '@/data/usecases/clients/create-client/create-client-use-case'
import { ClientsRepository } from '@/infra/database/postgres/clients/clients-postgres-repository'

export const makeCreateClientUseCase = (): CreateClientUseCase => {
  const clientRepo = new ClientsRepository()
  return new CreateClientUseCase(clientRepo, clientRepo)
}
