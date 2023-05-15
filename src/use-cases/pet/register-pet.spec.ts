import { InMemoryPetRepository } from '@/repositories/in-memory/in-memory-pet-repository'
import { RegisterPetUseCase } from './register-pet'

import { describe, beforeEach, it, expect } from 'vitest'
import { InMemoryOrgRepository } from '@/repositories/in-memory/in-memory-org-repository'
import { hash } from 'bcryptjs'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { InMemoryRequirementAdopted } from '@/repositories/in-memory/in-memory-requirement-adopted-repository'

let inMemoryPetRepository: InMemoryPetRepository
let inMemoryOrgRepository: InMemoryOrgRepository
let inMemoryRequirementAdopted: InMemoryRequirementAdopted

let sut: RegisterPetUseCase

describe('Register a new Pet', () => {
  beforeEach(() => {
    inMemoryPetRepository = new InMemoryPetRepository()
    inMemoryOrgRepository = new InMemoryOrgRepository()
    inMemoryRequirementAdopted = new InMemoryRequirementAdopted()

    sut = new RegisterPetUseCase(
      inMemoryPetRepository,
      inMemoryOrgRepository,
      inMemoryRequirementAdopted,
    )
  })

  it('should be able to register a new pet', async () => {
    const org = await inMemoryOrgRepository.create({
      responsible: 'Fagner',
      email: 'fagner@email.com',
      whatsapp: '999999999',
      address: 'Rua oito, 19, Centro, Couto de Magalhães',
      cep: '39188000',
      password_hash: await hash('123456', 6),
    })

    const { pet } = await sut.execute({
      name: 'Alfredo',
      about: `Eu sou um lindo doguinho de 3 anos, um jovel brincalhão que adora 
      fazer companhia, uma bagunça mas também ama uma soneca.`,
      age: 3,
      carry: 'Small',
      energy_level: 'High',
      level_of_independency: 'Medium',
      ambiente: 'Ambiente amplo',
      street: 'Rua oito',
      number: '19',
      neighborhood: 'Centro',
      city: 'Couto de Magalhães',
      state: 'Minas Gerais',
      org_id: org.id,
    })

    expect(pet.name).toEqual('Alfredo')
    expect(pet.id).toEqual(expect.any(String))
  })
  it('should not be able to register a new pet with invalid id', async () => {
    expect(async () => {
      await sut.execute({
        name: 'Alfredo',
        about: `Eu sou um lindo doguinho de 3 anos, um jovel brincalhão que adora 
        fazer companhia, uma bagunça mas também ama uma soneca.`,
        age: 3,
        carry: 'Small',
        energy_level: 'High',
        level_of_independency: 'Medium',
        ambiente: 'Ambiente amplo',
        street: 'Rua oito',
        number: '19',
        neighborhood: 'Centro',
        city: 'Couto de Magalhães',
        state: 'Minas Gerais',
        org_id: '123',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
  it('should not be able to register a new pet with requirement adopteds', async () => {
    const org = await inMemoryOrgRepository.create({
      responsible: 'Fagner',
      email: 'fagner@email.com',
      whatsapp: '999999999',
      address: 'Rua oito, 19, Centro, Couto de Magalhães',
      cep: '39188000',
      password_hash: await hash('123456', 6),
    })

    const { pet } = await sut.execute({
      name: 'Alfredo',
      about: `Eu sou um lindo doguinho de 3 anos, um jovel brincalhão que adora 
      fazer companhia, uma bagunça mas também ama uma soneca.`,
      age: 3,
      carry: 'Small',
      energy_level: 'High',
      level_of_independency: 'Medium',
      ambiente: 'Ambiente amplo',
      street: 'Rua oito',
      number: '19',
      neighborhood: 'Centro',
      city: 'Couto de Magalhães',
      state: 'Minas Gerais',
      org_id: org.id,
      requirements_adopted: ['Casa grande', 'Veterinario', 'Ração expecial'],
    })

    console.log(pet)
  })
})
