import { ListAllUsers } from '@/domain/usecases/users/list-all-users'
import { noContent } from '@/presentation/helpers/http-helper'
import { Controller, HttpRequest, HttpResponse } from '@/presentation/protocols'

export class ListAllUsersController implements Controller {
  constructor(private readonly listAllUsersUseCase: ListAllUsers) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.listAllUsersUseCase.execute()
    return noContent()
  }
}
