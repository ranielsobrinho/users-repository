import * as winston from 'winston'

const { transports } = winston

winston.addColors({
  info: 'black whiteBG',
  warn: 'black yellowBG',
  error: 'black redBG'
})

const myFormat = winston.format.printf(
  ({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`
)

const logger = winston.createLogger({
  transports: [
    new transports.Console({
      level: 'error',
      format: winston.format.json()
    }),
    new transports.Console({
      level: 'info',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        myFormat
      )
    }),
    new transports.Console({
      level: 'warn'
    })
  ],
  defaultMeta: true,
  exitOnError: false
})

export default logger
