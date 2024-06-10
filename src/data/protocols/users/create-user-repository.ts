import { UserModel } from '@/domain/models/user-model'

export interface CreateUserRepository {
  createUser(
    params: CreateUserRepository.Params
  ): Promise<CreateUserRepository.Result>
}

export namespace CreateUserRepository {
  export type Params = Omit<UserModel, 'id'>
  export type Result = UserModel | null
}
