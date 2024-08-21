import { UpdateUserById } from '@/domain/usecases/users/update-user-by-id'
import {
  badRequest,
  notFound,
  ok,
  serverError
} from '@/presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class UpdateUserController implements Controller {
  constructor(private readonly updateUserByIdUseCase: UpdateUserById) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { userId } = httpRequest.params
      const { name, email, phone } = httpRequest.body
      const userOrError = await this.updateUserByIdUseCase.execute(userId, {
        name,
        email,
        phone
      })

      if (userOrError.isLeft() && userOrError.value.name === 'NotFoundError') {
        return notFound(userOrError.value as Error)
      } else if (
        userOrError.isLeft() &&
        userOrError.value.name === 'RequiredFieldError'
      ) {
        return badRequest(userOrError.value as Error)
      }
      return ok(userOrError.value)
    } catch (error) {
      return serverError(error)
    }
  }
}
