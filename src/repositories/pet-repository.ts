import { SearchPetQuery } from '@/use-cases/search-pet'
import { Pet, Prisma } from '@prisma/client'

export interface PetRepository {
  create(data: Prisma.PetUncheckedCreateInput): Promise<Pet>
  findById(id: string): Promise<Pet | null>
  fetchPetByCity(city: string): Promise<Pet[]>
  searchMany(search: SearchPetQuery, page: number): Promise<Pet[]>
}
