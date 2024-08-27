import { Authentication } from '@/domain/usecases/authentication/authentication'
import { noContent, serverError } from '@/presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class LoginController implements Controller {
  constructor(private readonly authenticationUseCase: Authentication) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, phone } = httpRequest.body
      await this.authenticationUseCase.execute({ email, phone })
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
