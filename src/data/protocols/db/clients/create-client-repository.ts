import { ClientModel } from '@/domain/models/client-model'

export interface CreateClientRepository {
  createClient(
    params: CreateClientRepository.Params
  ): Promise<CreateClientRepository.Result>
}

export namespace CreateClientRepository {
  export type Params = Omit<ClientModel, 'id'>
  export type Result = ClientModel | null
}
