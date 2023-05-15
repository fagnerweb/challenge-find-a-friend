import { Prisma, Org } from '@prisma/client'
import { OrgRepository } from '../org-repository'
import { randomUUID } from 'crypto'

export class InMemoryOrgRepository implements OrgRepository {
  org: Org[] = []

  async create({
    id,
    responsible,
    email,
    whatsapp,
    address,
    cep,
    password_hash,
  }: Prisma.OrgCreateInput): Promise<Org> {
    const newOrg = {
      id: id || randomUUID(),
      responsible,
      email,
      whatsapp,
      address,
      cep,
      password_hash,
      created_at: new Date(),
    }

    this.org.push(newOrg)

    return newOrg
  }

  async findById(id: string): Promise<Org | null> {
    const org = this.org.find((item) => item.id === id)

    if (!org) return null

    return org
  }

  async findByEmail(email: string): Promise<Org | null> {
    const org = this.org.find((item) => item.email === email)

    if (!org) return null

    return org
  }
}
