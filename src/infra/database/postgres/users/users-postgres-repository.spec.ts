import { vi, describe, it, expect, beforeEach } from 'vitest'
import DatabaseHelper from '../helpers/postgres-helper'
import { UsersRepository } from './users-postgres-repository' // Adjust the import path to match your project structure

vi.mock('node:crypto', () => ({
  randomUUID: vi.fn(() => 'fixed-uuid-for-testing')
}))

describe('UsersRepository', () => {
  let sut: UsersRepository
  let mockClient: {
    query: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    mockClient = {
      query: vi.fn()
    }
    vi.spyOn(DatabaseHelper, 'getClient').mockResolvedValue(mockClient as any)
    sut = new UsersRepository()
  })

  describe('createUser', () => {
    it('should insert a new user and return the created user', async () => {
      const params = {
        name: 'test_name',
        email: 'test_email@example.com',
        phone: '1234567890',
        password: 'test_password'
      }
      const expectedResult = {
        id: 'fixed-uuid-for-testing',
        name: params.name,
        email: params.email,
        phone: params.phone,
        password: params.password
      }
      mockClient.query.mockResolvedValueOnce({ rows: [expectedResult] })

      const result = await sut.createUser(params)

      expect(result).toEqual(expectedResult)
      expect(mockClient.query).toHaveBeenCalledWith(
        'INSERT INTO users(id, name, email, phone, password) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [
          'fixed-uuid-for-testing',
          params.name,
          params.email,
          params.phone,
          params.password
        ]
      )
    })

    it('should return null if the insert query returns no rows', async () => {
      const params = {
        name: 'test_name',
        email: 'test_email@example.com',
        phone: '1234567890',
        password: 'test_password'
      }
      mockClient.query.mockResolvedValueOnce({ rows: [] })

      const result = await sut.createUser(params)

      expect(result).toBeNull()
    })
  })

  describe('getByEmail', () => {
    it('should return the user if found by email', async () => {
      const email = 'test_email@example.com'
      const expectedResult = {
        id: 'fixed-uuid-for-testing',
        name: 'test_name',
        email,
        phone: '1234567890',
        password: 'test_password'
      }
      mockClient.query.mockResolvedValueOnce({ rows: [expectedResult] })

      const result = await sut.getByEmail(email)

      expect(result).toEqual(expectedResult)
      expect(mockClient.query).toHaveBeenCalledWith(
        'SELECT id, name, email, phone, password FROM users WHERE email = $1',
        [email]
      )
    })

    it('should return null if no user is found by email', async () => {
      const email = 'nonexistent_email@example.com'
      mockClient.query.mockResolvedValueOnce({ rows: [] })

      const result = await sut.getByEmail(email)

      expect(result).toBeNull()
      expect(mockClient.query).toHaveBeenCalledWith(
        'SELECT id, name, email, phone, password FROM users WHERE email = $1',
        [email]
      )
    })
  })

  describe('listAll', () => {
    it('should return all users without passwords', async () => {
      const expectedResult = [
        {
          id: 'uuid1',
          name: 'user1',
          email: 'user1@example.com',
          phone: '1234567890',
          created_at: new Date()
        },
        {
          id: 'uuid2',
          name: 'user2',
          email: 'user2@example.com',
          phone: '0987654321',
          created_at: new Date()
        }
      ]
      mockClient.query.mockResolvedValueOnce({ rows: expectedResult })

      const result = await sut.listAll()

      expect(result).toEqual(expectedResult)
      expect(mockClient.query).toHaveBeenCalledWith(
        'SELECT id, name, email, phone, created_at FROM users'
      )
    })

    it('should return an empty array if no users exist', async () => {
      mockClient.query.mockResolvedValueOnce({ rows: [] })

      const result = await sut.listAll()

      expect(result).toEqual([])
      expect(mockClient.query).toHaveBeenCalledWith(
        'SELECT id, name, email, phone, created_at FROM users'
      )
    })
  })

  describe('getById', () => {
    it('should return the user by ID without password', async () => {
      const userId = 'fixed-uuid-for-testing'
      const expectedResult = {
        id: userId,
        name: 'test_name',
        email: 'test_email@example.com',
        phone: '1234567890',
        created_at: new Date()
      }
      mockClient.query.mockResolvedValueOnce({ rows: [expectedResult] })

      const result = await sut.getById(userId)

      expect(result).toEqual(expectedResult)
      expect(mockClient.query).toHaveBeenCalledWith(
        'SELECT id, name, email, phone, created_at FROM users WHERE users.id = $1',
        [userId]
      )
    })

    it('should return null if no user is found by ID', async () => {
      const userId = 'nonexistent-uuid'
      mockClient.query.mockResolvedValueOnce({ rows: [] })

      const result = await sut.getById(userId)

      expect(result).toBeNull()
      expect(mockClient.query).toHaveBeenCalledWith(
        'SELECT id, name, email, phone, created_at FROM users WHERE users.id = $1',
        [userId]
      )
    })
  })

  describe('deleteById', () => {
    it('should delete the user by ID and return the deleted row (if any)', async () => {
      const userId = 'fixed-uuid-for-testing'
      const expectedResult = {
        id: userId,
        name: 'test_name',
        email: 'test_email@example.com',
        phone: '1234567890'
      }
      mockClient.query.mockResolvedValueOnce({ rows: [expectedResult] })

      const result = await sut.deleteById(userId)

      expect(result).toEqual(expectedResult)
      expect(mockClient.query).toHaveBeenCalledWith(
        'DELETE FROM users WHERE users.id = $1',
        [userId]
      )
    })

    it('should return undefined if no row is deleted (Postgres DELETE returns rowCount, but code assumes rows[0])', async () => {
      const userId = 'nonexistent-uuid'
      mockClient.query.mockResolvedValueOnce({ rows: [] }) // Simulate no deletion

      const result = await sut.deleteById(userId)

      expect(result).toBeUndefined() // Based on code: result.rows[0] would be undefined if empty
      expect(mockClient.query).toHaveBeenCalledWith(
        'DELETE FROM users WHERE users.id = $1',
        [userId]
      )
    })
  })

  describe('update', () => {
    it('should update the user by ID and return the updated user', async () => {
      const userId = 'fixed-uuid-for-testing'
      const updateData = {
        name: 'updated_name',
        email: 'updated_email@example.com',
        phone: 'updated_phone'
      }
      const expectedResult = {
        id: userId,
        name: updateData.name,
        email: updateData.email,
        phone: updateData.phone,
        created_at: new Date()
      }
      mockClient.query.mockResolvedValueOnce({ rows: [expectedResult] })

      const result = await sut.update(userId, updateData)

      expect(result).toEqual(expectedResult)
      expect(mockClient.query).toHaveBeenCalledWith(
        'UPDATE users SET name = $1, email = $2, phone = $3 WHERE id = $4 RETURNING id, name, email, phone, created_at',
        [updateData.name, updateData.email, updateData.phone, userId]
      )
    })

    it('should return undefined if no user is updated (e.g., ID not found)', async () => {
      const userId = 'nonexistent-uuid'
      const updateData = {
        name: 'updated_name',
        email: 'updated_email@example.com',
        phone: 'updated_phone'
      }
      mockClient.query.mockResolvedValueOnce({ rows: [] })

      const result = await sut.update(userId, updateData)

      expect(result).toBeUndefined() // Based on code: result.rows[0] if empty
      expect(mockClient.query).toHaveBeenCalledWith(
        'UPDATE users SET name = $1, email = $2, phone = $3 WHERE id = $4 RETURNING id, name, email, phone, created_at',
        [updateData.name, updateData.email, updateData.phone, userId]
      )
    })
  })
})
