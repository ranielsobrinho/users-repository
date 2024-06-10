import { UserModel } from '@/domain/models/user-model'
import { Either } from '@/shared'

export interface ListAllUsers {
  execute(): Promise<Either<Error, ListAllUsers.Result>>
}

export namespace ListAllUsers {
  export type Result = UserModel[]
}
