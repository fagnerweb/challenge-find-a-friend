import { Prisma, RequirementsAdopted } from '@prisma/client'

export interface RequirementsAdotedRepository {
  create(
    data: Prisma.RequirementsAdoptedUncheckedCreateInput,
  ): Promise<RequirementsAdopted>
}
