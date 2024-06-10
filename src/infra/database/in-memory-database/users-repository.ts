import { CreateUserRepository } from '@/data/protocols/users/create-user-repository'
import { GetUserByEmailRepository } from '@/data/protocols/users/get-user-by-email-repository'
import { GetUserByIdRepository } from '@/data/protocols/users/get-user-by-id-repository'
import { ListAllUsersRepository } from '@/data/protocols/users/list-all-users-repository'
import { UserModel } from '@/domain/models/user-model'

export class InMemoryUsersRepository
  implements
    CreateUserRepository,
    GetUserByEmailRepository,
    ListAllUsersRepository,
    GetUserByIdRepository
{
  private repository: UserModel[] = []

  async createUser(
    params: CreateUserRepository.Params
  ): Promise<CreateUserRepository.Result> {
    const exists = await this.getByEmail(params.email)
    if (!exists) {
      const user = {
        id: '1',
        name: params.name,
        email: params.email,
        phone: params.phone
      }
      this.repository.push(user)
      return user
    }
    return null
  }

  async getByEmail(email: string): Promise<GetUserByEmailRepository.Result> {
    const found = this.repository.find((user) => user.email === email)
    return found || null
  }

  async listAll(): Promise<ListAllUsersRepository.Result> {
    return this.repository
  }

  async getById(userId: string): Promise<GetUserByIdRepository.Result> {
    const user = this.repository.find((user) => user.id === userId)
    return user || null
  }
}
