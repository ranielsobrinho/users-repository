import { CreateClient } from '@/domain/usecases/clients/create-client'
import {
  badRequest,
  noContent,
  serverError
} from '@/presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class CreateClientController implements Controller {
  constructor(private readonly createClientUseCase: CreateClient) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { name, email, phone } = httpRequest.body
      const response = await this.createClientUseCase.execute({
        name,
        email,
        phone
      })
      if (response.isLeft()) {
        return badRequest(response.value)
      }
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
