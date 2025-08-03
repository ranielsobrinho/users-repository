export interface SendNewAccountEmailNotificationProtocol {
  sendEmail(
    params: SendNewAccountEmailNotificationProtocol.Params
  ): Promise<SendNewAccountEmailNotificationProtocol.Result>
}

export namespace SendNewAccountEmailNotificationProtocol {
  export type Params = {
    email: string
    subject: string
    body: string
  }

  export type Result = void
}
