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
      }
    }
  }
})

describe('BcryptAdapter', () => {
  it('Should call hash with correct value', async () => {
    const salt = 12
    const sut = new BcryptAdapter(salt)
    const hashSpy = vi.spyOn(bcrypt, 'hash')
    await sut.generate('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })
})
