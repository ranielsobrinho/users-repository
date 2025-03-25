import { ListAllUsers } from '@/domain/usecases/users/list-all-users'
import { noContent, ok, serverError } from '@/presentation/helpers/http-helper'
import { Controller, HttpResponse } from '@/presentation/protocols'

export class ListAllUsersController implements Controller {
  constructor(private readonly listAllUsersUseCase: ListAllUsers) {}
  async handle(): Promise<HttpResponse> {
    try {
      const response = await this.listAllUsersUseCase.execute()
      if (response.isRight() && response.value.length >= 1) {
        return ok(response.value)
      }
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
