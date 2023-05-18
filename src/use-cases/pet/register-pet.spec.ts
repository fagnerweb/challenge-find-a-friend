import { InMemoryPetRepository } from '@/repositories/in-memory/in-memory-pet-repository'
import { RegisterPetUseCase } from './register-pet'

import { describe, beforeEach, it, expect } from 'vitest'
import { InMemoryOrgRepository } from '@/repositories/in-memory/in-memory-org-repository'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { InMemoryRequirementAdopted } from '@/repositories/in-memory/in-memory-requirement-adopted-repository'

let inMemoryPetRepository: InMemoryPetRepository
let inMemoryOrgRepository: InMemoryOrgRepository
let inMemoryRequirementAdopted: InMemoryRequirementAdopted

let sut: RegisterPetUseCase

describe('Register a new Pet', () => {
  beforeEach(() => {
    inMemoryOrgRepository = new InMemoryOrgRepository()
    inMemoryRequirementAdopted = new InMemoryRequirementAdopted()
    inMemoryPetRepository = new InMemoryPetRepository(
      inMemoryOrgRepository,
      inMemoryRequirementAdopted,
    )

    sut = new RegisterPetUseCase(inMemoryPetRepository, inMemoryOrgRepository)
  })

  it('should be able to register a new pet', async () => {
    const org = await inMemoryOrgRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      whatsapp: '999999999',
      cep: '47802-028',
      password_hash: '123456',
      street: 'Oito',
      number: '19',
      neighborhood: 'Centro',
      city: 'Couto de Magalhães',
      state: 'MG',
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
        org_id: '123',
      })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
  it('should not be able to register a new pet with requirement adopteds', async () => {
    const org = await inMemoryOrgRepository.create({
      name: 'John Doe',
      email: 'johndoe@email.com',
      whatsapp: '999999999',
      cep: '47802-028',
      password_hash: '123456',
      street: 'Oito',
      number: '19',
      neighborhood: 'Centro',
      city: 'Couto de Magalhães',
      state: 'MG',
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
      org_id: org.id,
    })

    await inMemoryRequirementAdopted.create({
      pet_id: pet.id,
      description: 'Casa grande',
    })
    await inMemoryRequirementAdopted.create({
      pet_id: pet.id,
      description: 'Veterinario',
    })
    await inMemoryRequirementAdopted.create({
      pet_id: pet.id,
      description: 'Ração expecial',
    })

    const requirements = await inMemoryRequirementAdopted.findManyById(pet.id)

    expect(requirements).toEqual([
      expect.objectContaining({ description: 'Casa grande' }),
      expect.objectContaining({ description: 'Veterinario' }),
      expect.objectContaining({
        description: 'Ração expecial',
      }),
    ])
  })
})
