import { z } from 'zod'

export const TermEnum = z.enum(['Fall', 'Spring', 'Summer'])

export const SimpleDate = z.object({
  term: TermEnum,
  year: z.number().int(),
})

export const RoleSchema = z.object({
  startDate: SimpleDate,
  level: z.number(),
  title: z.string(),
  endDate: SimpleDate.nullable(),
  division: z.string(),
})

export const SocialLinksSchema = z.object({
  github: z.string().optional(),
  linkedin: z.string().optional(),
  personalEmail: z.string().optional(),
}).optional()

export const OfficerSchema = z.object({
  accessLevel: z.number(),
  expectedGrad: SimpleDate,
  year: z.number().int().optional(),
  firstName: z.string(),
  lastName: z.string(),
  netId: z.string(),
  isActive: z.boolean(),
  joinDate: SimpleDate,
  UID: z.string().optional(),
  socialLinks: SocialLinksSchema,
  standing: z.string(),
  roles: z.array(RoleSchema),
})

export type Officer = z.infer<typeof OfficerSchema>
