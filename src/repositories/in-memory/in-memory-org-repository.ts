import { Prisma, Org } from '@prisma/client'
import { OrgRepository } from '../org-repository'
import { randomUUID } from 'crypto'

export class InMemoryOrgRepository implements OrgRepository {
  org: Org[] = []

  async create({
    id,
    name,
    email,
    whatsapp,
    cep,
    password_hash,
    street,
    number,
    neighborhood,
    city,
    state,
  }: Prisma.OrgCreateInput): Promise<Org> {
    const newOrg = {
      id: id || randomUUID(),
      name,
      email,
      whatsapp,
      cep,
      password_hash,
      street,
      number,
      neighborhood,
      city,
      state,
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

  async findManyByCity(city: string): Promise<Org[]> {
    const orgs = this.org.filter((org) => org.city === city)
    return orgs
  }
}
