export class RequiredFieldError extends Error {
  constructor(field: string) {
    super(`${field} is a required field.`)
    this.name = 'RequiredFieldError'
  }
}
