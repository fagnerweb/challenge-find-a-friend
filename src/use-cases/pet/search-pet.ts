import { PetRepository } from '@/repositories/pet-repository'
import { Carry, EnergyLevel, LevelOfIndependency, Pet } from '@prisma/client'

export interface SearchPetQuery {
  city: string
  age?: number
  carry?: Carry
  energy_level?: EnergyLevel
  level_of_independency?: LevelOfIndependency
}

interface SearchPetUseCaseResponse {
  pets: Pet[]
}

export class SearchPetUseCase {
  constructor(private petRepository: PetRepository) {}

  async execute(
    search: SearchPetQuery,
    page: number,
  ): Promise<SearchPetUseCaseResponse> {
    const pets = await this.petRepository.searchMany(search, page)

    return { pets }
  }
}
