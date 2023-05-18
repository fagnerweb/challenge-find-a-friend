import { InMemoryPetRepository } from '@/repositories/in-memory/in-memory-pet-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { SearchPetUseCase } from './search-pet'
import { InMemoryOrgRepository } from '@/repositories/in-memory/in-memory-org-repository'

let inMemoryPetRepository: InMemoryPetRepository
let inMemoryOrgRepository: InMemoryOrgRepository
let sut: SearchPetUseCase

describe('Search Pet', () => {
  beforeEach(() => {
    inMemoryOrgRepository = new InMemoryOrgRepository()
    inMemoryPetRepository = new InMemoryPetRepository(inMemoryOrgRepository)
    sut = new SearchPetUseCase(inMemoryPetRepository)
  })

  it('should be able to search a pet by city', async () => {
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

    await inMemoryPetRepository.create({
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

    const { pets } = await sut.execute({ city: 'Couto de Magalhães' }, 1)
    expect(pets[0].name).toEqual('Alfredo')
  })

  it('should be able to search a pet by age', async () => {
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

    await inMemoryPetRepository.create({
      name: 'Alfredo 1',
      about: 'about 1',
      age: 3,
      carry: 'Small',
      energy_level: 'High',
      level_of_independency: 'Medium',
      ambiente: 'Ambiente amplo',
      org_id: org.id,
    })

    await inMemoryPetRepository.create({
      name: 'Alfredo 2',
      about: 'about 2',
      age: 6,
      carry: 'Small',
      energy_level: 'High',
      level_of_independency: 'Medium',
      ambiente: 'Ambiente amplo',
      org_id: 'invalid-id',
      // org_id: org.id,
    })

    const { pets } = await sut.execute(
      { city: 'Couto de Magalhães', age: 3 },
      1,
    )

    expect(pets[0].name).toEqual('Alfredo 1')
  })
})
