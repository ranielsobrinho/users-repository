import { describe, it, vi, expect } from 'vitest'
import bcrypt from 'bcrypt'
import { BcryptAdapter } from './bcrypt-adapter'

vi.mock('bcrypt', async () => {
  const actual = await vi.importActual('bcrypt')
  return {
    default: {
      ...actual,
      hash: (): Promise<string> => {
        return Promise.resolve('hashed_value')
      },
      compare: (): Promise<boolean> => {
        return Promise.resolve(true)
      }
    }
  }
})

const salt = 12

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('BcryptAdapter', () => {
  describe('generate', () => {
    it('Should call hash with correct value', async () => {
      const sut = makeSut()
      const hashSpy = vi.spyOn(bcrypt, 'hash')
      await sut.generate('any_value')
      expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })

    it('Should throw if hash throws', async () => {
      const sut = makeSut()
      vi.spyOn(bcrypt, 'hash').mockImplementationOnce(async () => {
        return Promise.reject(new Error())
      })
      const promise = sut.generate('any_value')
      await expect(promise).rejects.toThrow(new Error())
    })

    it('Should return a hash on success', async () => {
      const sut = makeSut()
      const hash = await sut.generate('any_value')
      expect(hash).toBe('hashed_value')
    })
  })

  describe('compare', () => {
    it('Should call compare with correct values', async () => {
      const sut = makeSut()
      const hashSpy = vi.spyOn(bcrypt, 'compare')
      await sut.compare('any_value', 'any_hashed_value')
      expect(hashSpy).toHaveBeenCalledWith('any_value', 'any_hashed_value')
    })
  })
})
