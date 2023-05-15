import { Prisma, RequirementsAdopted } from '@prisma/client'
import { RequirementsAdotedRepository } from '../requirements-adopted-repository'
import { randomUUID } from 'crypto'

export class InMemoryRequirementAdopted
  implements RequirementsAdotedRepository
{
  requirementsAdopted: RequirementsAdopted[] = []

  async create(
    data: Prisma.RequirementsAdoptedUncheckedCreateInput,
  ): Promise<RequirementsAdopted> {
    const requirements = {
      id: data.id || randomUUID(),
      description: data.description,
      pet_id: data.pet_id,
    }

    this.requirementsAdopted.push(requirements)

    return requirements
  }
}
