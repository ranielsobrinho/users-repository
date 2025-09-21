import { ClientModel } from '@/domain/models/client-model'

export interface GetClientByEmailRepository {
  getByEmail(email: string): Promise<GetClientByEmailRepository.Result>
}

export namespace GetClientByEmailRepository {
  export type Result = ClientModel | null
}
