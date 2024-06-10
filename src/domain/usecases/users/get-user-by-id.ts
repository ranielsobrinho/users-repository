import { UserModel } from '@/domain/models/user-model'
import { Either } from '@/shared'

export interface GetUserById {
  execute(userId: string): Promise<Either<Error, GetUserById.Result>>
}

export namespace GetUserById {
  export type Result = UserModel | null
}
