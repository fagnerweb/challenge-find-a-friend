export class EmailOrPasswordWrong extends Error {
  constructor() {
    super('Email or password incorrect')
  }
}
