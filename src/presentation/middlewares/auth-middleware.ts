import logger from '@/main/config/logger'
import { NextFunction, Request, Response } from 'express'
import * as jwt from 'jsonwebtoken'

const KEY = '[AuthMiddleware]: '

export class AuthMiddleware {
  async handle(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> {
    try {
      const { authorization, Authorization } = req.headers
      const authHeader = (authorization || Authorization) as string

      const salt = process.env.JWT_SALT

      if (!salt) {
        throw new Error('JWT salt is not setted')
      }

      if (!authHeader) {
        return res.status(401).json({
          error: 'Token não encontrado'
        })
      }

      const [, token] = authHeader.split(' ')
      const payload = jwt.decode(token)

      const verify = jwt.verify(token, salt)

      if (!verify) {
        return res.status(401).json({
          error: 'Token inválido'
        })
      }

      if (!payload) {
        return res.status(401).json({
          error: 'Token inválido'
        })
      }

      return next()
    } catch (error) {
      logger.error(`${KEY} ${error}`)
      return res.status(500).json({
        error: 'Token inválido'
      })
    }
  }
}
