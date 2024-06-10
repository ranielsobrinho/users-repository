import { ListAllUsers } from '@/domain/usecases/users/list-all-users'
import { noContent, serverError } from '@/presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class ListAllUsersController implements Controller {
  constructor(private readonly listAllUsersUseCase: ListAllUsers) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      await this.listAllUsersUseCase.execute()
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
