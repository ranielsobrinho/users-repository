import { describe, expect, it, vi } from 'vitest'
import { left, right } from '../../../../shared'
import { GetUserByEmailRepository } from '../../../protocols/users/get-user-by-email-repository'
import { CreateUserRepository } from '../../../protocols/users/create-user-repository'
import { EmailAlreadyInUseError, RequiredFieldError } from '../../../errors'
import { CreateUserUseCase } from './add-user-use-case'
import { TokenGenerator } from '../../../protocols/criptography/token-generator'
import { Encrypter } from '../../../protocols/criptography/encrypter'
import { SendNewAccountEmailNotificationProtocol } from '../../../protocols/messaging/email/new-account-notification-protocol'

const makeCreateUserRequest = () => ({
  name: 'any_name',
  email: 'any_email',
  phone: 'any_phone',
  password: 'any_password'
})

const makeCreateUserRequestWithHashedPassword = () => ({
  name: 'any_name',
  email: 'any_email',
  phone: 'any_phone',
  password: 'hashed_password'
})

const makeUserModel = () => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email',
  phone: 'any_phone',
  password: 'hashed_password'
})

const makeGetUserByEmailRepositoryStub = (): GetUserByEmailRepository => {
  class GetUserByEmailRepositoryStub implements GetUserByEmailRepository {
    async getByEmail(_email: string): Promise<GetUserByEmailRepository.Result> {
      return null
    }
  }
  return new GetUserByEmailRepositoryStub()
}

const makeCreateUserRepositoryStub = (): CreateUserRepository => {
  class CreateUserRepositoryStub implements CreateUserRepository {
    async createUser(
      _params: CreateUserRepository.Params
    ): Promise<CreateUserRepository.Result> {
      return makeUserModel()
    }
  }
  return new CreateUserRepositoryStub()
}

const makeTokenGeneratorStub = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate(
      _param: TokenGenerator.Param
    ): Promise<TokenGenerator.Result> {
      return 'any_token'
    }
  }
  return new TokenGeneratorStub()
}

const makeEncrypterStub = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async generate(_value: string): Promise<string> {
      return 'hashed_password'
    }
  }
  return new EncrypterStub()
}

const makeCreateNotificationPayload = (): any => ({
  email: makeCreateUserRequest().email,
  subject: 'NOVA CONTA CRIADA',
  body: `Obrigado ${makeCreateUserRequest().name}, sua conta foi criada. Esperamos que tenha uma ótima experiência conosco.`
})

const makeSendNewAccountEmailNotificationProtocolStub =
  (): SendNewAccountEmailNotificationProtocol => {
    class SendNewAccountNotificationProtocolStub
      implements SendNewAccountEmailNotificationProtocol
    {
      async sendEmail(
        params: SendNewAccountEmailNotificationProtocol.Params
      ): Promise<SendNewAccountEmailNotificationProtocol.Result> {}
    }
    return new SendNewAccountNotificationProtocolStub()
  }

type SutTypes = {
  sut: CreateUserUseCase
  getUserByEmailRepositoryStub: GetUserByEmailRepository
  createUserRepositoryStub: CreateUserRepository
  tokenGeneratorStub: TokenGenerator
  sendNewAccountEmailNotificationProtocolStub: SendNewAccountEmailNotificationProtocol
}

const makeSut = (): SutTypes => {
  const getUserByEmailRepositoryStub = makeGetUserByEmailRepositoryStub()
  const createUserRepositoryStub = makeCreateUserRepositoryStub()
  const tokenGeneratorStub = makeTokenGeneratorStub()
  const encrypterStub = makeEncrypterStub()
  const sendNewAccountEmailNotificationProtocolStub =
    makeSendNewAccountEmailNotificationProtocolStub()

  const sut = new CreateUserUseCase(
    getUserByEmailRepositoryStub,
    createUserRepositoryStub,
    tokenGeneratorStub,
    encrypterStub,
    sendNewAccountEmailNotificationProtocolStub
  )
  return {
    sut,
    getUserByEmailRepositoryStub,
    createUserRepositoryStub,
    tokenGeneratorStub,
    sendNewAccountEmailNotificationProtocolStub
  }
}

describe('CreateUserUseCase', () => {
  it('Should returns left error if CreateUserUseCase received null params', async () => {
    const { sut } = makeSut()
    const user = await sut.execute({
      name: 'any_name',
      email: 'any_email',
      phone: undefined,
      password: 'any_password'
    })
    expect(user).toEqual(left(new RequiredFieldError('phone')))
  })

  it('Should call GetUserByEmailRepository with correct param', async () => {
    const { sut, getUserByEmailRepositoryStub } = makeSut()
    const getUserByEmailSpy = vi.spyOn(
      getUserByEmailRepositoryStub,
      'getByEmail'
    )
    await sut.execute(makeCreateUserRequest())
    expect(getUserByEmailSpy).toHaveBeenCalledOnce()
    expect(getUserByEmailSpy).toHaveBeenCalledWith(
      makeCreateUserRequest().email
    )
  })

  it('Should throw if GetUserByEmailRepository throws', async () => {
    const { sut, getUserByEmailRepositoryStub } = makeSut()
    vi.spyOn(getUserByEmailRepositoryStub, 'getByEmail').mockRejectedValueOnce(
      new Error()
    )
    const promise = sut.execute(makeCreateUserRequest())
    await expect(promise).rejects.toThrow(new Error())
  })

  it('Should returns left error if GetUserByEmailRepository returns a user', async () => {
    const { sut, getUserByEmailRepositoryStub } = makeSut()
    vi.spyOn(getUserByEmailRepositoryStub, 'getByEmail').mockResolvedValueOnce(
      makeUserModel()
    )
    const user = await sut.execute(makeCreateUserRequest())
    expect(user).toEqual(
      left(new EmailAlreadyInUseError(makeCreateUserRequest().email))
    )
  })

  it('Should call CreateUserRepository with correct params', async () => {
    const { sut, createUserRepositoryStub } = makeSut()
    const createUserSpy = vi.spyOn(createUserRepositoryStub, 'createUser')
    await sut.execute(makeCreateUserRequest())
    expect(createUserSpy).toHaveBeenCalledOnce()
    expect(createUserSpy).toHaveBeenCalledWith(
      makeCreateUserRequestWithHashedPassword()
    )
  })

  it('Should return error if CreateUserRepository returns null', async () => {
    const { sut, createUserRepositoryStub } = makeSut()
    vi.spyOn(createUserRepositoryStub, 'createUser').mockResolvedValueOnce(null)
    const userData = await sut.execute(makeCreateUserRequest())
    expect(userData).toEqual(
      left(new EmailAlreadyInUseError(makeCreateUserRequest().email))
    )
  })

  it('Should throw if CreateUserRepository throws', async () => {
    const { sut, createUserRepositoryStub } = makeSut()
    vi.spyOn(createUserRepositoryStub, 'createUser').mockRejectedValueOnce(
      new Error()
    )
    const promise = sut.execute(makeCreateUserRequest())
    await expect(promise).rejects.toThrow(new Error())
  })

  it('Should call TokenGenerator with correct param', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    const tokenGenSpy = vi.spyOn(tokenGeneratorStub, 'generate')
    await sut.execute(makeCreateUserRequest())
    expect(tokenGenSpy).toHaveBeenCalledWith('any_id')
  })

  it('Should throw if TokenGenerator throws', async () => {
    const { sut, tokenGeneratorStub } = makeSut()
    vi.spyOn(tokenGeneratorStub, 'generate').mockRejectedValueOnce(new Error())
    const promise = sut.execute(makeCreateUserRequest())
    expect(promise).rejects.toThrow(new Error())
  })

  it('Should call SendNewAccountEmailNotificationProtocol with correct params', async () => {
    const { sut, sendNewAccountEmailNotificationProtocolStub } = makeSut()
    const sendNotificationSpy = vi.spyOn(
      sendNewAccountEmailNotificationProtocolStub,
      'sendEmail'
    )
    await sut.execute(makeCreateUserRequest())
    expect(sendNotificationSpy).toHaveBeenCalledWith(
      makeCreateNotificationPayload()
    )
    expect(sendNotificationSpy).toHaveBeenCalledOnce()
  })

  it('Should return access token on success', async () => {
    const { sut } = makeSut()
    const accessToken = await sut.execute(makeCreateUserRequest())
    expect(accessToken).toEqual(right('any_token'))
  })
})
