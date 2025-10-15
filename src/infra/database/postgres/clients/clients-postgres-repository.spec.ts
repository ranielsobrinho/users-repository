import { describe, vi, it, expect, beforeEach } from 'vitest'
import DatabaseHelper from '../helpers/postgres-helper'
import { ClientsRepository } from './clients-postgres-repository'

vi.mock('node:crypto', () => ({
  randomUUID: vi.fn(() => 'fixed-uuid-for-testing')
}))

describe('ClientsRepository', () => {
  let sut: ClientsRepository
  let mockClient: {
    query: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    mockClient = {
      query: vi.fn()
    }
    vi.spyOn(DatabaseHelper, 'getClient').mockResolvedValue(mockClient as any)
    sut = new ClientsRepository()
  })

  describe('createClient', () => {
    it('should insert a new client and return the created client', async () => {
      const params = {
        name: 'any_name',
        email: 'any_email@mail.com',
        phone: '1234567890'
      }
      const expectedResult = {
        id: 'fixed-uuid-for-testing',
        name: 'any_name',
        email: 'any_email@mail.com',
        phone: '1234567890',
        created_at: new Date()
      }

      mockClient.query.mockResolvedValueOnce({ rows: [expectedResult] })

      const result = await sut.createClient(params)

      expect(result).toEqual(expectedResult)
      expect(mockClient.query).toHaveBeenCalledWith(
        'INSERT INTO clients(id, name, email, phone) VALUES ($1, $2, $3, $4) RETURNING *',
        ['fixed-uuid-for-testing', params.name, params.email, params.phone]
      )
    })

    it('should return null if the insert query returns no rows', async () => {
      const params = {
        name: 'any_name',
        email: 'any_email@mail.com',
        phone: '1234567890'
      }
      mockClient.query.mockResolvedValueOnce({ rows: [] })

      const result = await sut.createClient(params)

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
        'SELECT id, name, email, phone FROM clients WHERE email = $1',
        [email]
      )
    })

    it('should return null if no user is found by email', async () => {
      const email = 'nonexistent_email@example.com'
      mockClient.query.mockResolvedValueOnce({ rows: [] })

      const result = await sut.getByEmail(email)

      expect(result).toBeNull()
      expect(mockClient.query).toHaveBeenCalledWith(
        'SELECT id, name, email, phone FROM clients WHERE email = $1',
        [email]
      )
    })
  })
})
