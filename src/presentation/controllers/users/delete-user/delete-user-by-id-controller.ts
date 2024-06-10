import { DeleteUserById } from '@/domain/usecases/users/delete-user-by-id'
import { noContent, serverError } from '@/presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class DeleteUserByIdController implements Controller {
  constructor(private readonly deleteUserByIdUseCase: DeleteUserById) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { userId } = httpRequest.body
      await this.deleteUserByIdUseCase.execute(userId)
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
