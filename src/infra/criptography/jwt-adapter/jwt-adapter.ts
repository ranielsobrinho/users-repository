import { TokenGenerator } from '@/data/protocols/criptography/token-generator'
import jwt from 'jsonwebtoken'

export class JwtAdapter implements TokenGenerator {
  constructor(private readonly salt: string) {}

  async generate(param: TokenGenerator.Param): Promise<TokenGenerator.Result> {
    jwt.sign(param, this.salt, { expiresIn: '12h' })
    return 'any_token'
  }
}
