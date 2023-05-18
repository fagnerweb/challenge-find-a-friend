import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { OrgRepository } from '@/repositories/org-repository'
import { PetRepository } from '@/repositories/pet-repository'
import { Pet } from '@prisma/client'

interface RegisterPetUseCaseRequest {
  name: string
  about: string
  age: number
  carry: 'Small' | 'Medium' | 'Big'
  energy_level: 'VeryLow' | 'Low' | 'Moderate' | 'High' | 'VeryHigh'
  level_of_independency: 'Low' | 'Medium' | 'High'
  ambiente: string
  petPhotos?: string[]
  requirements_adopted?: string[]
  org_id: string
}

interface RegisterPetUseCaseResponse {
  pet: Pet
}

export class RegisterPetUseCase {
  constructor(
    private petsRepository: PetRepository,
    private orgsRepository: OrgRepository,
  ) {}

  async execute({
    name,
    about,
    age,
    ambiente,
    carry,
    energy_level,
    level_of_independency,
    org_id,
  }: RegisterPetUseCaseRequest): Promise<RegisterPetUseCaseResponse> {
    const orgNotFound = await this.orgsRepository.findById(org_id)

    if (!orgNotFound) {
      throw new ResourceNotFoundError()
    }

    const pet = await this.petsRepository.create({
      name,
      about,
      age,
      carry,
      energy_level,
      level_of_independency,
      ambiente,
      org_id,
    })

    return { pet }
  }
}
