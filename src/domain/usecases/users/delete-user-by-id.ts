import { Either } from '@/shared'

export interface DeleteUserById {
  execute(userId: string): Promise<Either<Error, DeleteUserById.Result>>
}

export namespace DeleteUserById {
  export type Result = void
}
