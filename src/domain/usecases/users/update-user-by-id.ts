import { UserModel } from '@/domain/models/user-model'
import { Either } from '@/shared'

export interface UpdateUserById {
  execute(
    userId: string,
    params: UpdateUserById.Params
  ): Promise<Either<Error, UpdateUserById.Result>>
}

export namespace UpdateUserById {
  export type Params = Omit<UserModel, 'id' | 'password'>
  export type Result = Omit<UserModel, 'password'>
}
