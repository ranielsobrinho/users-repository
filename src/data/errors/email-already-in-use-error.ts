export class EmailAlreadyInUseError extends Error {
  constructor(email: string) {
    super(`Email ${email} already in use.`)
    this.name = 'EmailAlreadyInUseError'
  }
}
