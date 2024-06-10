import { CreateUserRepository } from '@/data/protocols/users/create-user-repository'
import { GetUserByEmailRepository } from '@/data/protocols/users/get-user-by-email-repository'
import { UserModel } from '@/domain/models/user-model'

export class InMemoryUsersRepository implements GetUserByEmailRepository {
  private repository: UserModel[] = []

  async getByEmail(email: string): Promise<GetUserByEmailRepository.Result> {
    const found = this.repository.find((user) => user.email === email)
    return found || null
  }
}
