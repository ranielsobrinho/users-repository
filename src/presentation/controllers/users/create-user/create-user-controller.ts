import { Controller } from '@/presentation/protocols/controller'
import { HttpRequest, HttpResponse } from '@/presentation/protocols'
import { CreateUser } from '@/domain/usecases/users/create-user'
import { badRequest, ok, serverError } from '@/presentation/helpers/http-helper'

export class CreateUserController implements Controller {
  constructor(private readonly createUserUseCase: CreateUser) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { name, email, phone } = httpRequest.body
      const response = await this.createUserUseCase.execute({
        name,
        email,
        phone
      })

      if (response.isLeft()) {
        return badRequest(response.value)
      }
      return ok({
        token: response.value
      })
    } catch (error) {
      return serverError(error)
    }
  }
}
