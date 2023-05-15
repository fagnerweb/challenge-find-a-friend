import { InMemoryOrgRepository } from '@/repositories/in-memory/in-memory-org-repository'
import { beforeEach, describe, it, expect } from 'vitest'
import { CreateOrgUseCase } from './create-org'
import { OrgAlreadyExists } from '@/errors/org-already-exists-error'
import { PasswordLessThenSixCaracters } from '@/errors/password-less-then-six-caracters-error'

describe('Create Org', () => {
  let inMemoryOrgRepository: InMemoryOrgRepository
  let sut: CreateOrgUseCase

  beforeEach(() => {
    inMemoryOrgRepository = new InMemoryOrgRepository()
    sut = new CreateOrgUseCase(inMemoryOrgRepository)
  })

  it('should be able to create a new organization', async () => {
    const { org } = await sut.execute({
      responsible: 'Antônio Bandeira',
      email: 'nome@email.com',
      cep: '39188000',
      address: 'Rua do meio',
      whatsapp: '81912345678',
      password: '123456',
    })

    expect(org.id).toEqual(expect.any(String))
    expect(org.created_at).toEqual(expect.any(Date))
  })

  it('should not be able to create a organization with the same email', async () => {
    await sut.execute({
      responsible: 'Antônio Bandeira',
      email: 'nome@email.com',
      cep: '39188000',
      address: 'Rua do meio',
      whatsapp: '81912345678',
      password: '123456',
    })

    expect(async () => {
      await sut.execute({
        responsible: 'Antônio Bandeira',
        email: 'nome@email.com',
        cep: '39188000',
        address: 'Rua do meio',
        whatsapp: '81912345678',
        password: '123456',
      })
    }).rejects.toBeInstanceOf(OrgAlreadyExists)
  })

  it('should not be able to create a organization with password less then 6 caracteres', () => {
    expect(async () => {
      await sut.execute({
        responsible: 'Antônio Bandeira',
        email: 'nome@email.com',
        cep: '39188000',
        address: 'Rua do meio',
        whatsapp: '81912345678',
        password: '12345',
      })
    }).rejects.toBeInstanceOf(PasswordLessThenSixCaracters)
  })
})
