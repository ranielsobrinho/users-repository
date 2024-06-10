import { describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '../../in-memory-database/users-repository'

const makeCreateUserRequest = () => ({
  name: 'any_name',
  email: 'any_email',
  phone: 'any_phone'
})

const makeCreatedUser = () => ({
  id: '1',
  name: 'any_name',
  email: 'any_email',
  phone: 'any_phone'
})

const makeSut = () => {
  return new InMemoryUsersRepository()
}
describe('UsersRepository', () => {
  describe('getByEmail', () => {
    it('Should return null if email is not taken', async () => {
      const sut = makeSut()
      const user = await sut.getByEmail('any_email')
      expect(user).toBeNull()
    })

    it('Should return user if email is taken', async () => {
      const sut = makeSut()
      await sut.createUser(makeCreateUserRequest())
      const user = await sut.getByEmail('any_email')
      expect(user).toEqual(makeCreatedUser())
    })
  })

  describe('createUser', () => {
    it('Should return null if email already exists', async () => {
      const sut = makeSut()
      await sut.createUser(makeCreateUserRequest())
      const userCreated = await sut.createUser(makeCreateUserRequest())
      expect(userCreated).toBeNull()
    })

    it('Should return user created if email does not exists', async () => {
      const sut = makeSut()
      const userCreated = await sut.createUser(makeCreateUserRequest())
      expect(userCreated).toEqual(makeCreatedUser())
    })
  })
})
