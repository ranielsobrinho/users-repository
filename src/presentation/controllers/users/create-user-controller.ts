import { Controller } from '@/presentation/protocols/controller'
import { HttpRequest, HttpResponse } from '@/presentation/protocols'
import { CreateUser } from '@/domain/usecases/users/create-user'
import { noContent, serverError } from '@/presentation/helpers/http-helper'

export class CreateUserController implements Controller {
  constructor(private readonly createUserUseCase: CreateUser) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { name, email, phone } = httpRequest.body
      await this.createUserUseCase.execute({
        name,
        email,
        phone
      })
      return noContent()
    } catch (error) {
      return serverError(error as unknown as Error)
    }
  }
}
