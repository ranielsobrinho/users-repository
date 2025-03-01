import request from 'supertest'
import app from '../config/app'
import DatabaseHelper from '../../infra/database/postgres/helpers/postgres-helper'
import { describe, it, beforeAll, afterAll } from 'vitest'

describe('Users Routes', () => {
  beforeAll(async () => {
    await DatabaseHelper.connect()
  })

  afterAll(async () => {
    await DatabaseHelper.disconnect()
  })

  describe('GET /health', () => {
    it('Should return 200 if API is running', async () => {
      await request(app).get('/api/health').expect(200)
    })
  })

  // FIX: Erro ao tentar acessar os endpoints da API
  describe.skip('GET /users', () => {
    it('Should return 204 if users list is empty', async () => {
      await request(app).get('/api/users').expect(204)
    })
  })
})
