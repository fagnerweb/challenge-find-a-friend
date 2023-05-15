import { EmailOrPasswordWrong } from '@/errors/email-or-passoword-wrong'
import { OrgRepository } from '@/repositories/org-repository'
import { Org } from '@prisma/client'
import { compare } from 'bcryptjs'

interface AuthenticateUseCaseRequest {
  email: string
  password: string
}

export class AuthenticateUseCase {
  constructor(private orgRepository: OrgRepository) {}

  async execute({ email, password }: AuthenticateUseCaseRequest): Promise<Org> {
    const org = await this.orgRepository.findByEmail(email)

    if (!org) {
      throw new EmailOrPasswordWrong()
    }

    const isPasswordCorrect = await compare(password, org.password_hash)

    if (!isPasswordCorrect) {
      throw new EmailOrPasswordWrong()
    }

    return org
  }
}
