import { UserModel } from '@/domain/models/user-model'

export interface ListAllUsersRepository {
  listAll(): Promise<ListAllUsersRepository.Result>
}

export namespace ListAllUsersRepository {
  export type Result = UserModel[]
}
