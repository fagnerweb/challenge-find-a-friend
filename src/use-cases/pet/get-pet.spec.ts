import { InMemoryPetRepository } from '@/repositories/in-memory/in-memory-pet-repository'
import { describe, beforeEach, it, expect } from 'vitest'
import { GetPetUseCase } from './get-pet'
import { randomUUID } from 'crypto'
import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { InMemoryOrgRepository } from '@/repositories/in-memory/in-memory-org-repository'

describe('Get a Pet', () => {
  let inMemoryPetRepository: InMemoryPetRepository
  let inMemoryOrgRepository: InMemoryOrgRepository
  let sut: GetPetUseCase

  beforeEach(() => {
    inMemoryOrgRepository = new InMemoryOrgRepository()
    inMemoryPetRepository = new InMemoryPetRepository(inMemoryOrgRepository)
    sut = new GetPetUseCase(inMemoryPetRepository)
  })

  it('should be able to get a pet by id', async () => {
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

    const petInMemory = (inMemoryPetRepository.pets = [
      {
        id: randomUUID(),
        name: 'Alfredo',
        about: `Eu sou um lindo doguinho de 3 anos, um jovel brincalhão que adora 
        fazer companhia, uma bagunça mas também ama uma soneca.`,
        age: 3,
        carry: 'Small',
        energy_level: 'High',
        level_of_independency: 'Medium',
        ambiente: 'Ambiente amplo',
        created_at: new Date(),
        org_id: org.id,
      },
    ])[0]

    const { pet } = await sut.execute({ pet_id: petInMemory.id })

    expect(pet).toEqual(
      expect.objectContaining({
        name: 'Alfredo',
        about: `Eu sou um lindo doguinho de 3 anos, um jovel brincalhão que adora 
        fazer companhia, uma bagunça mas também ama uma soneca.`,
        age: 3,
        carry: 'Small',
        energy_level: 'High',
        level_of_independency: 'Medium',
        ambiente: 'Ambiente amplo',
        created_at: petInMemory.created_at,
      }),
    )
  })

  it('should not be able to get a pet with wrong id', () => {
    expect(async () => {
      await sut.execute({ pet_id: randomUUID() })
    }).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
