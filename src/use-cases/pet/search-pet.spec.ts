import { InMemoryPetRepository } from '@/repositories/in-memory/in-memory-pet-repository'
import { beforeEach, describe, expect, it } from 'vitest'
import { SearchPetUseCase } from './search-pet'

let inMemoryPetRepository: InMemoryPetRepository
let sut: SearchPetUseCase

describe('Search Pet', () => {
  beforeEach(() => {
    inMemoryPetRepository = new InMemoryPetRepository()
    sut = new SearchPetUseCase(inMemoryPetRepository)
  })

  it('should be able to search a pet by city', async () => {
    await inMemoryPetRepository.create({
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
    })

    const { pets } = await sut.execute({ city: 'Couto de Magalhães' }, 1)
    expect(pets[0].name).toEqual('Alfredo')
  })

  it('should be able to search a pet by age', async () => {
    await inMemoryPetRepository.create({
      name: 'Alfredo 1',
      about: 'about 1',
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
    })

    await inMemoryPetRepository.create({
      name: 'Alfredo 2',
      about: 'about 2',
      age: 6,
      carry: 'Small',
      energy_level: 'High',
      level_of_independency: 'Medium',
      ambiente: 'Ambiente amplo',
      street: 'Rua oito',
      number: '19',
      neighborhood: 'Centro',
      city: 'Couto de Magalhães',
      state: 'Minas Gerais',
    })

    const { pets } = await sut.execute(
      { city: 'Couto de Magalhães', age: 6 },
      1,
    )

    expect(pets[0].name).toEqual('Alfredo 2')
  })
})
