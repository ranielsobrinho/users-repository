import { describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '../../in-memory-database/users-repository'

describe('UsersRepository', () => {
  describe('getByEmail', () => {
    it('Should return null if email is not taken', async () => {
      const sut = new InMemoryUsersRepository()
      const user = await sut.getByEmail('any_email')
      expect(user).toBeNull()
    })

    it('Should return user if email is taken', async () => {
      const sut = new InMemoryUsersRepository()
      await sut.createUser({
        name: 'any_name',
        email: 'any_email',
        phone: 'any_phone'
      })
      const user = await sut.getByEmail('any_email')
      expect(user).toEqual({
        id: '1',
        name: 'any_name',
        email: 'any_email',
        phone: 'any_phone'
      })
    })
  })

  describe('createUser', () => {
    it('Should return null if email already exists', async () => {
      const sut = new InMemoryUsersRepository()
      await sut.createUser({
        name: 'any_name',
        email: 'any_email',
        phone: 'any_phone'
      })
      const userCreated = await sut.createUser({
        name: 'any_name',
        email: 'any_email',
        phone: 'any_phone'
      })
      expect(userCreated).toBeNull()
    })
  })
})
