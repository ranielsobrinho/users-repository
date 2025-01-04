import { describe, it, vi, expect } from 'vitest'
import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'

vi.mock('jsonwebtoken', async () => {
  const actual = await vi.importActual('jsonwebtoken')
  return {
    default: {
      ...actual,
      sign: (): Promise<string> => {
        return Promise.resolve('any_token')
      }
    }
  }
})

const makeSut = (): JwtAdapter => {
  return new JwtAdapter('secret')
}

describe('JwtAdapter', () => {
  describe('generate', () => {
    it('should call sign with correct params', async () => {
      const sut = makeSut()
      const generateTokenSpy = vi.spyOn(jwt, 'sign')
      await sut.generate('any_id')
      expect(generateTokenSpy).toHaveBeenCalledWith('any_id', 'secret')
    })

    it('Should throw if sign throws', async () => {
      const sut = makeSut()
      vi.spyOn(jwt, 'sign').mockImplementationOnce(() => {
        throw new Error()
      })
      const promise = sut.generate('any_id')
      await expect(promise).rejects.toThrow()
    })

    it('Should return access token on success', async () => {
      const sut = makeSut()
      const accessToken = await sut.generate('any_id')
      expect(accessToken).toBe('any_token')
    })
  })
})
