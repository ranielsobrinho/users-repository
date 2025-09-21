import { ClientModel } from '@/domain/models/client-model'
import { Either } from '@/shared'

export interface CreateClient {
  execute(
    params: CreateClient.Params
  ): Promise<Either<Error, CreateClient.Result>>
}

export namespace CreateClient {
  export type Params = Omit<ClientModel, 'id'>
  export type Result = ClientModel
}
