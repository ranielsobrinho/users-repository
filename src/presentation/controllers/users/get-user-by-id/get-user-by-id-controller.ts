import { GetUserById } from '@/domain/usecases/users/get-user-by-id'
import { noContent, serverError } from '@/presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class GetUserByIdController implements Controller {
  constructor(private readonly getUserByIdUseCase: GetUserById) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { userId } = httpRequest.body
      await this.getUserByIdUseCase.execute(userId!)
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
