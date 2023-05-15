import { InMemoryOrgRepository } from '@/repositories/in-memory/in-memory-org-repository'
import { describe, it, beforeEach, expect } from 'vitest'
import { AuthenticateUseCase } from './authenticate-org'
import { CreateOrgUseCase } from './create-org'
import { EmailOrPasswordWrong } from '@/errors/email-or-passoword-wrong'

let inMemoryOrgRepository: InMemoryOrgRepository
let createOrg: CreateOrgUseCase
let sut: AuthenticateUseCase

describe('Authenticate Org', () => {
  beforeEach(() => {
    inMemoryOrgRepository = new InMemoryOrgRepository()
    createOrg = new CreateOrgUseCase(inMemoryOrgRepository)
    sut = new AuthenticateUseCase(inMemoryOrgRepository)
  })

  it('should be able to authenticate with email and password', async () => {
    const { org } = await createOrg.execute({
      responsible: 'Antônio Bandeira',
      email: 'nome@email.com',
      cep: '39188000',
      address: 'Rua do meio',
      whatsapp: '81912345678',
      password: '123456',
    })

    const response = await sut.execute({ email: org.email, password: '123456' })

    expect(response).toEqual(org)
  })

  it('should not be able to authenticate with wrong email', async () => {
    await createOrg.execute({
      responsible: 'Antônio Bandeira',
      email: 'nome@email.com',
      cep: '39188000',
      address: 'Rua do meio',
      whatsapp: '81912345678',
      password: '123456',
    })

    expect(async () => {
      await sut.execute({
        email: 'fagner@email.com',
        password: '123456',
      })
    }).rejects.toBeInstanceOf(EmailOrPasswordWrong)
  })

  it('should not be able to authenticate with wrong password', async () => {
    const { org } = await createOrg.execute({
      responsible: 'Antônio Bandeira',
      email: 'nome@email.com',
      cep: '39188000',
      address: 'Rua do meio',
      whatsapp: '81912345678',
      password: '123456',
    })

    expect(async () => {
      await sut.execute({
        email: org.email,
        password: '123457',
      })
    }).rejects.toBeInstanceOf(EmailOrPasswordWrong)
  })
})
