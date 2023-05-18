import { InMemoryOrgRepository } from '@/repositories/in-memory/in-memory-org-repository'
import { CreateOrgUseCase } from '../organization/register-org'

export function makeRegisterUseCase() {
  const inMemoryOrgRepository = new InMemoryOrgRepository()
  const sut = new CreateOrgUseCase(inMemoryOrgRepository)

  return sut
}
