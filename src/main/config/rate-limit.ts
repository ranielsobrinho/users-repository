import { rateLimit } from 'express-rate-limit'

export const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100 // Limit each IP to 100 requests per windowMs
})
