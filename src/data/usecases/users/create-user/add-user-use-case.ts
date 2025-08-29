import { EmailAlreadyInUseError } from '@/data/errors/email-already-in-use-error'
import { RequiredFieldError } from '@/data/errors/required-field-error'
import { Encrypter } from '@/data/protocols/criptography/encrypter'
import { TokenGenerator } from '@/data/protocols/criptography/token-generator'
import { SendNewAccountEmailNotificationProtocol } from '@/data/protocols/messaging/email/new-account-notification-protocol'
import { CreateUserRepository } from '@/data/protocols/users/create-user-repository'
import { GetUserByEmailRepository } from '@/data/protocols/users/get-user-by-email-repository'
import { validate } from '@/data/utils/validate-params'
import { CreateUser } from '@/domain/usecases/users/create-user'
import { logger } from '@/main/config/pino-logger'
import { Either, left, right } from '@/shared'

const KEY = '[CreateUserUseCase]:'
export class CreateUserUseCase implements CreateUser {
  constructor(
    private readonly getUserByEmailRepository: GetUserByEmailRepository,
    private readonly createUserRepository: CreateUserRepository,
    private readonly tokenGenerator: TokenGenerator,
    private readonly encrypter: Encrypter,
    private readonly sendNewAccountEmailNotification: SendNewAccountEmailNotificationProtocol
  ) {}
  async execute(
    params: CreateUser.Params
  ): Promise<
    Either<EmailAlreadyInUseError | RequiredFieldError, CreateUser.Result>
  > {
    const { email, password } = params

    const validationError = await validate(params)
    if (validationError.length) {
      return left(new RequiredFieldError(validationError))
    }

    logger.info(`${KEY} Get user with email: ${email}`)
    const user = await this.getUserByEmailRepository.getByEmail(email)
    if (!user) {
      const hashedPassword = await this.encrypter.generate(password)
      const dataDto = {
        ...params,
        password: hashedPassword
      }
      logger.info(`${KEY} Create user with params: ${params}`)
      const userCreated = await this.createUserRepository.createUser(dataDto)
      if (!userCreated) {
        return left(new EmailAlreadyInUseError(email))
      }
      logger.info(`${KEY} Generating token with user's credentials`)
      const accessToken = await this.tokenGenerator.generate(userCreated.id)
      logger.info(`${KEY} Sending notification to created user`)
      await this.sendNewAccountEmailNotification.sendEmail({
        email: userCreated.email,
        subject: 'NOVA CONTA CRIADA',
        body: `Obrigado ${userCreated.name}, sua conta foi criada. Esperamos que tenha uma ótima experiência conosco.`
      })
      return right(accessToken)
    }
    logger.error(`${KEY} User with email: ${params.email} already exists`)
    return left(new EmailAlreadyInUseError(email))
  }
}
