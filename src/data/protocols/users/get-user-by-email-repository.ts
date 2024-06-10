import { UserModel } from '@/domain/models/user-model'
import { Either } from '@/shared'

export interface GetUserByEmailRepository {
  getByEmail(
    email: string
  ): Promise<Either<Error, GetUserByEmailRepository.Result>>
}

export namespace GetUserByEmailRepository {
  export type Result = UserModel
}
