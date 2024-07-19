import { UserModel } from '@/domain/models/user-model'

export interface UpdateUserByIdRepository {
  update(
    userId: string,
    updateUserData: UpdateUserByIdRepository.Params
  ): Promise<UpdateUserByIdRepository.Result>
}

export namespace UpdateUserByIdRepository {
  export type Params = Omit<UserModel, 'id'>
  export type Result = UserModel
}
