export class PasswordLessThenSixCaracters extends Error {
  constructor() {
    super('Password must be at least 6 characters long')
  }
}
