import { GetUserById } from '@/domain/usecases/users/get-user-by-id'
import { notFound, ok, serverError } from '@/presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class GetUserByIdController implements Controller {
  constructor(private readonly getUserByIdUseCase: GetUserById) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { userId } = httpRequest.body

      const user = await this.getUserByIdUseCase.execute(userId!)

      if (user.isLeft()) {
        return notFound(user.value)
      }

      return ok(user.value)
    } catch (error) {
      return serverError(error)
    }
  }
}
