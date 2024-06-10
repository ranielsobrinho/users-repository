import { UserModel } from '@/domain/models/user-model'

export interface GetUserByEmailRepository {
  getByEmail(email: string): Promise<GetUserByEmailRepository.Result>
}

export namespace GetUserByEmailRepository {
  export type Result = UserModel | null
}
