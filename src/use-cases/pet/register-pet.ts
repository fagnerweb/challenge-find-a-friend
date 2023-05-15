import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { OrgRepository } from '@/repositories/org-repository'
import { PetRepository } from '@/repositories/pet-repository'
import { RequirementsAdotedRepository } from '@/repositories/requirements-adopted-repository'
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
  street: string
  number: string
  neighborhood: string
  city: string
  state: string
  org_id: string
}

interface RegisterPetUseCaseResponse {
  pet: Pet
}

export class RegisterPetUseCase {
  constructor(
    private petsRepository: PetRepository,
    private orgRepository: OrgRepository,
    private requirementAdoptedRepository: RequirementsAdotedRepository,
  ) {}

  async execute({
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
    requirements_adopted,
  }: RegisterPetUseCaseRequest): Promise<RegisterPetUseCaseResponse> {
    const orgExists = await this.orgRepository.findById(org_id)

    if (!orgExists) {
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
      street,
      number,
      neighborhood,
      city,
      state,
      org_id,
    })

    if (requirements_adopted) {
      requirements_adopted.map((requirement_adopted) =>
        this.requirementAdoptedRepository.create({
          description: requirement_adopted,
          pet_id: pet.id,
        }),
      )
    }

    return { pet }
  }
}
