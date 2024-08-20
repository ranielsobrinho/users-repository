import { describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '../../in-memory-database/users-repository'

const makeCreateUserRequest = () => ({
  name: 'any_name',
  email: 'any_email',
  phone: 'any_phone'
})

const makeUpdateUserRequest = () => ({
  name: 'other_name',
  email: 'other_email',
  phone: 'other_phone'
})

const makeCreatedUser = () => ({
  id: '1',
  name: 'any_name',
  email: 'any_email',
  phone: 'any_phone'
})

const makeUpdatedUser = () => ({
  id: '1',
  name: 'other_name',
  email: 'other_email',
  phone: 'other_phone'
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

  describe('listAll', () => {
    it('Should return all users', async () => {
      const sut = makeSut()
      await sut.createUser(makeCreateUserRequest())
      const users = await sut.listAll()
      expect(users[0].id).toBeTruthy()
      expect(users[0].name).toEqual('any_name')
      expect(users[0].email).toEqual('any_email')
      expect(users[0].phone).toEqual('any_phone')
      expect(users.length).toBe(1)
    })
  })

  describe('getById', () => {
    it('Should return null if user does not exists', async () => {
      const sut = makeSut()
      const userData = await sut.getById('any_id')
      expect(userData).toBeNull()
    })

    it('Should return user data on success', async () => {
      const sut = makeSut()
      await sut.createUser(makeCreateUserRequest())
      const userData = await sut.getById('1')
      expect(userData).toEqual(makeCreatedUser())
    })
  })

  describe('deleteById', () => {
    it('Should delete user by id', async () => {
      const sut = makeSut()
      await sut.createUser(makeCreateUserRequest())
      const users = await sut.listAll()
      expect(users.length).toBe(1)
      const deletedUser = await sut.deleteById('1')
      const usersDelete = await sut.listAll()
      expect(deletedUser).toEqual(makeCreatedUser())
      expect(usersDelete.length).toBe(0)
    })
  })

  describe('update', () => {
    it('Should update user by id', async () => {
      const sut = makeSut()
      const users = await sut.listAll()
      await sut.createUser(makeCreateUserRequest())
      await sut.update('1', makeUpdateUserRequest())
      expect(users[0].id).toBeTruthy()
      expect(users[0].name).toEqual('other_name')
      expect(users[0].email).toEqual('other_email')
      expect(users[0].phone).toEqual('other_phone')
      expect(users.length).toBe(1)
    })
  })
})
