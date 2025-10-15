import { CreateClient } from '@/domain/usecases/clients/create-client'
import { noContent, serverError } from '@/presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class CreateClientController implements Controller {
  constructor(private readonly createClientUseCase: CreateClient) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { name, email, phone } = httpRequest.body
      await this.createClientUseCase.execute({ name, email, phone })
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
