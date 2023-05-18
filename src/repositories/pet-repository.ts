import { SearchPetQuery } from '@/use-cases/pet/search-pet'
import { Pet, Prisma, RequirementsAdopted } from '@prisma/client'

export interface PetRepository {
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
  findById(id: string): Promise<Pet | null>
  fetchPetByCity(city: string): Promise<Pet[]>
  fetchRequirementsAdopted(pet_id: string): Promise<RequirementsAdopted[]>
  searchMany(search: SearchPetQuery, page: number): Promise<Pet[]>
}
