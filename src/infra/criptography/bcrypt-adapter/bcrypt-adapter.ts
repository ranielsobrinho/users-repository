import { Encrypter } from '@/data/protocols/criptography/encrypter'
import { HashComparer } from '@/data/protocols/criptography/hash-comparer'
import { logger } from '@/main/config/pino-logger'
import bcrypt from 'bcrypt'

const KEY = '[BcryptAdapter]:'
export class BcryptAdapter implements Encrypter, HashComparer {
  constructor(private readonly salt: number) {}

  async generate(value: string): Promise<string> {
    logger.info(`${KEY} Generating hash value`)
    const hash = await bcrypt.hash(value, this.salt)
    return hash
  }

  async compare(value: string, hash: string): Promise<boolean> {
    logger.info(`${KEY} Comparing hashed value with provided value`)
    const isValid = await bcrypt.compare(value, hash)
    return isValid
  }
}
