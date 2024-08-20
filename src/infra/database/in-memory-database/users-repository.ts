import { CreateUserRepository } from '@/data/protocols/users/create-user-repository'
import { DeleteUserRepository } from '@/data/protocols/users/delete-user-repository'
import { GetUserByEmailRepository } from '@/data/protocols/users/get-user-by-email-repository'
import { GetUserByIdRepository } from '@/data/protocols/users/get-user-by-id-repository'
import { ListAllUsersRepository } from '@/data/protocols/users/list-all-users-repository'
import { UpdateUserByIdRepository } from '@/data/protocols/users/update-user-by-id-repository'
import { UserModel } from '@/domain/models/user-model'

export class InMemoryUsersRepository
  implements
    CreateUserRepository,
    GetUserByEmailRepository,
    ListAllUsersRepository,
    GetUserByIdRepository,
    DeleteUserRepository,
    UpdateUserByIdRepository
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

  async deleteById(userId: string): Promise<DeleteUserRepository.Result> {
    const deletedUser = this.repository.find((user) => user.id === userId)
    this.repository = this.repository.filter((user) => user.id !== userId)
    return deletedUser!
  }

  async update(
    userId: string,
    updateUserData: UpdateUserByIdRepository.Params
  ): Promise<UpdateUserByIdRepository.Result> {
    const found = this.repository.findIndex((user) => user.id === userId)
    this.repository[found] = { id: userId, ...updateUserData }
    return this.repository[found]
  }
}
