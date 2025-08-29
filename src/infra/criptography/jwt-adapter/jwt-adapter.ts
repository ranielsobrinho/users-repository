import { TokenGenerator } from '@/data/protocols/criptography/token-generator'
import { logger } from '@/main/config/pino-logger'
import jwt from 'jsonwebtoken'

const KEY = '[JwtAdapter]:'
export class JwtAdapter implements TokenGenerator {
  constructor(private readonly salt: string) {}

  async generate(param: TokenGenerator.Param): Promise<TokenGenerator.Result> {
    logger.info(`${KEY} Generating access token`)
    const accessToken = jwt.sign({ param }, this.salt)
    return accessToken
  }
}
