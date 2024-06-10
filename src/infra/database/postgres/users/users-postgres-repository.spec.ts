import { describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '../../in-memory-database/users-repository'

describe('UsersRepository', () => {
  describe('getByEmail', () => {
    it('Should return null if email is not taken', async () => {
      const sut = new InMemoryUsersRepository()
      const user = await sut.getByEmail('any_email')
      expect(user).toBeNull()
    })
  })
})
