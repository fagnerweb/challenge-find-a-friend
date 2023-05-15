import { Address, Prisma } from '@prisma/client'

export interface AddressRepository {
  create(data: Prisma.AddressUncheckedCreateInput): Promise<Address>
}
