import { UserModel } from '@/domain/models/user-model'

export interface DeleteUserRepository {
  deleteById(userId: string): Promise<DeleteUserRepository.Result>
}

export namespace DeleteUserRepository {
  export type Result = UserModel
}
