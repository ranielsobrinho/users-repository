import { GetUserById } from '@/domain/usecases/users/get-user-by-id'
import { noContent } from '@/presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class GetUserByIdController implements Controller {
  constructor(private readonly getUserByIdUseCase: GetUserById) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { userId } = httpRequest.body
    await this.getUserByIdUseCase.execute(userId!)
    return noContent()
  }
}
