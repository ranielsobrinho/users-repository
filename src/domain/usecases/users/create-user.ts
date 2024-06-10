import { UserModel } from '@/domain/models/user-model'
import { Either } from '@/shared'

export interface CreateUser {
  execute(params: CreateUser.Params): Promise<Either<Error, CreateUser.Result>>
}

export namespace CreateUser {
  export type Params = Omit<UserModel, 'id'>
  export type Result = void
}
