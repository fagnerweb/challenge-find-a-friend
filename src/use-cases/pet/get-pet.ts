import { ResourceNotFoundError } from '@/errors/resource-not-found-error'
import { PetRepository } from '@/repositories/pet-repository'
import { Pet } from '@prisma/client'

interface GetPetUseCaseRequest {
  pet_id: string
}

interface GetPetUseCaseResponse {
  pet: Pet
}

export class GetPetUseCase {
  constructor(private petsRepository: PetRepository) {}

  async execute({
    pet_id,
  }: GetPetUseCaseRequest): Promise<GetPetUseCaseResponse> {
    const pet = await this.petsRepository.findById(pet_id)

    if (!pet) {
      throw new ResourceNotFoundError()
    }

    return {
      pet,
    }
  }
}
