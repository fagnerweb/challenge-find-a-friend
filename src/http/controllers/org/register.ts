import { OrgAlreadyExists } from '@/errors/org-already-exists-error'
import { makeRegisterUseCase } from '@/use-cases/factories/make-register-use-case'
import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

export async function register(request: FastifyRequest, reply: FastifyReply) {
  const registerBodySchema = z.object({
    responsible: z.string(),
    email: z.string().email(),
    cep: z.string(),
    address: z.string(),
    whatsapp: z.string(),
    password: z.string(),
  })

  const { responsible, email, cep, address, whatsapp, password } =
    registerBodySchema.parse(request.body)

  try {
    const registerUseCase = makeRegisterUseCase()
    const { org } = await registerUseCase.execute({
      responsible,
      email,
      cep,
      address,
      whatsapp,
      password,
    })

    reply.status(200).send(org)
  } catch (err) {
    if (err instanceof OrgAlreadyExists) {
      //
    }
    console.log(err)
  }
}
