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

const salt = 12

const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('BcryptAdapter', () => {
  it('Should call hash with correct value', async () => {
    const sut = makeSut()
    const hashSpy = vi.spyOn(bcrypt, 'hash')
    await sut.generate('any_value')
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })
})
