import * as winston from 'winston'

const { transports } = winston

winston.addColors({
  info: 'black whiteBG'
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
    })
  ],
  defaultMeta: true,
  exitOnError: false
})

export default logger
