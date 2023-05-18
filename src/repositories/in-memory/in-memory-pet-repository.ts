import { Pet, Prisma, RequirementsAdopted } from '@prisma/client'
import { PetRepository } from '../pet-repository'
import { randomUUID } from 'node:crypto'
import { SearchPetQuery } from '@/use-cases/pet/search-pet'
import { OrgRepository } from '../org-repository'
// import { AddressRepository } from '../address-repository'
import { RequirementsAdotedRepository } from '../requirements-adopted-repository'

export class InMemoryPetRepository implements PetRepository {
  pets: Pet[] = []
  orgRepository: OrgRepository
  requirementAdoptedRepository: RequirementsAdotedRepository

  constructor(
    orgRepository: OrgRepository,
    requirementAdoptedRepository: RequirementsAdotedRepository,
  ) {
    this.orgRepository = orgRepository
    this.requirementAdoptedRepository = requirementAdoptedRepository
  }

  async create({
    id,
    name,
    about,
    age,
    ambiente,
    carry,
    energy_level,
    level_of_independency,
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
    const orgs = await this.orgRepository.findManyByCity(city)

    const petsByOrgsInCity = this.pets.filter((pet) => {
      return orgs.find((org) => org.id === pet.org_id)
    })

    return petsByOrgsInCity
  }

  async fetchRequirementsAdopted(
    pet_id: string,
  ): Promise<RequirementsAdopted[]> {
    const requirementsAdopted =
      await this.requirementAdoptedRepository.findManyById(pet_id)
    return requirementsAdopted
  }

  async searchMany(search: SearchPetQuery, page: number): Promise<Pet[]> {
    let petsFiltered = await this.fetchPetByCity(search.city)
    petsFiltered.slice((page - 1) * 20, page * 20)

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
