import { makeCreateClientUseCase } from '@/main/factories/usecases/clients/create-client/create-client-use-case'
import { CreateClientController } from '@/presentation/controllers/clients/create-client/create-client-controller'
import { Controller } from '@/presentation/protocols'

export const makeCreateClientController = (): Controller => {
  return new CreateClientController(makeCreateClientUseCase())
}
