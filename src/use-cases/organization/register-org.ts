import { OrgAlreadyExists } from '@/errors/org-already-exists-error'
import { PasswordLessThenSixCaracters } from '@/errors/password-less-then-six-caracters-error'
import { OrgRepository } from '@/repositories/org-repository'
import { Org } from '@prisma/client'
import { hash } from 'bcryptjs'

interface CreateOrgUseCaseRequest {
  responsible: string
  email: string
  cep: string
  address: string
  whatsapp: string
  password: string
}

interface CreateOrgUseCaseResponse {
  org: Org
}
export class CreateOrgUseCase {
  constructor(public orgsRepository: OrgRepository) {}

  async execute({
    responsible,
    email,
    cep,
    address,
    whatsapp,
    password,
  }: CreateOrgUseCaseRequest): Promise<CreateOrgUseCaseResponse> {
    const orgAlreadyExists = await this.orgsRepository.findByEmail(email)

    if (orgAlreadyExists) {
      throw new OrgAlreadyExists()
    }

    if (password.length < 6) {
      throw new PasswordLessThenSixCaracters()
    }

    const passwordHash = await hash(password, 6)

    const org = await this.orgsRepository.create({
      responsible,
      email,
      cep,
      address,
      whatsapp,
      password_hash: passwordHash,
    })

    return { org }
  }
}
