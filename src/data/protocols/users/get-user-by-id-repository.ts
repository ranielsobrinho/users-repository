import { UserModel } from '@/domain/models/user-model'

export interface GetUserByIdRepository {
  getById(userId: string): Promise<GetUserByIdRepository.Result>
}

export namespace GetUserByIdRepository {
  export type Result = UserModel | null
}
