import { Pet, Prisma } from '@prisma/client'
import { PetRepository } from '../pet-repository'
import { randomUUID } from 'node:crypto'
import { SearchPetQuery } from '@/use-cases/search-pet'

export class InMemoryPetRepository implements PetRepository {
  pets: Pet[] = []

  async create({
    id,
    name,
    about,
    age,
    ambiente,
    carry,
    energy_level,
    level_of_independency,
    street,
    number,
    neighborhood,
    city,
    state,
    org_id,
  }: Prisma.PetUncheckedCreateInput): Promise<Pet> {
    const pet = {
      id: id || randomUUID(),
      name,
      about,
      age,
      ambiente,
      carry,
      energy_level,
      level_of_independency,
      street,
      number,
      neighborhood,
      city,
      state,
      created_at: new Date(),
      org_id,
    }

    this.pets.push(pet)

    return pet
  }

  async findById(id: string): Promise<Pet | null> {
    const pet = this.pets.find((pet) => pet.id === id)

    if (!pet) return null

    return pet
  }

  async fetchPetByCity(city: string): Promise<Pet[]> {
    return this.pets.filter((pet) => pet.city === city)
  }

  async searchMany(search: SearchPetQuery, page: number): Promise<Pet[]> {
    let petsFiltered = this.pets
      .filter((pet) => pet.city === search.city)
      .slice((page - 1) * 20, page * 20)

    if (search.age) {
      petsFiltered = petsFiltered.filter((pet) => pet.age === search.age)
    }

    if (search.carry) {
      petsFiltered = petsFiltered.filter((pet) => pet.carry === search.carry)
    }

    if (search.energy_level) {
      petsFiltered = petsFiltered.filter(
        (pet) => pet.energy_level === search.energy_level,
      )
    }

    if (search.level_of_independency) {
      petsFiltered = petsFiltered.filter(
        (pet) => pet.level_of_independency === search.level_of_independency,
      )
    }

    return petsFiltered
  }
}
