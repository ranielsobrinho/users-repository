import { DeleteUserById } from '@/domain/usecases/users/delete-user-by-id'
import { NotFoundError } from '@/presentation/errors/not-found-error'
import {
  noContent,
  notFound,
  serverError
} from '@/presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class DeleteUserByIdController implements Controller {
  constructor(private readonly deleteUserByIdUseCase: DeleteUserById) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { userId } = httpRequest.body
      const response = await this.deleteUserByIdUseCase.execute(userId)
      if (response.isLeft()) {
        return notFound(new NotFoundError())
      }
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
