import { UpdateUserById } from '@/domain/usecases/users/update-user-by-id'
import { noContent, serverError } from '@/presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class UpdateUserController implements Controller {
  constructor(private readonly updateUserByIdUseCase: UpdateUserById) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { userId } = httpRequest.params
      const { name, email, phone } = httpRequest.body
      await this.updateUserByIdUseCase.execute(userId, {
        name,
        email,
        phone
      })

      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
