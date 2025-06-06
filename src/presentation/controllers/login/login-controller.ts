import { Authentication } from '@/domain/usecases/authentication/authentication'
import { ok, serverError, notFound } from '@/presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class LoginController implements Controller {
  constructor(private readonly authenticationUseCase: Authentication) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = httpRequest.body
      const tokenOrError = await this.authenticationUseCase.execute({
        email,
        password
      })

      if (tokenOrError.isLeft()) {
        return notFound(tokenOrError.value)
      }

      return ok({
        token: tokenOrError.value
      })
    } catch (error) {
      return serverError(error)
    }
  }
}
