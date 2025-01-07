import { Encrypter } from '@/data/protocols/criptography/encrypter'
import { HashComparer } from '@/data/protocols/criptography/hash-comparer'
import bcrypt from 'bcrypt'

export class BcryptAdapter implements Encrypter, HashComparer {
  constructor(private readonly salt: number) {}

  async generate(value: string): Promise<string> {
    const hash = await bcrypt.hash(value, this.salt)
    return hash
  }

  async compare(value: string, hash: string): Promise<boolean> {
    await bcrypt.compare(value, hash)
    return true
  }
}
