import { Either } from '@/shared'

export type AuthenticationModel = {
  email: string
  password: string
}

export interface Authentication {
  execute(
    params: Authentication.Params
  ): Promise<Either<Error, Authentication.Result>>
}

export namespace Authentication {
  export type Params = AuthenticationModel
  export type Result = string
}
