import { z } from 'zod'

export const FirestoreTimestamp = z.object({
  _seconds: z.number(),
  _nanoseconds: z.number(),
})

export const IsoDateString = z.string().refine((s) => !isNaN(Date.parse(s)), { message: 'Invalid ISO date string' })
export const RoleDate = z.union([FirestoreTimestamp, IsoDateString])

export const RoleSchema = z.object({
  startDate: RoleDate,
  level: z.number(),
  title: z.string(),
  endDate: RoleDate.nullable(),
  division: z.string(),
})

export const SocialLinksSchema = z.object({
  github: z.string().optional(),
  linkedin: z.string().optional(),
  personalEmail: z.string().optional(),
}).optional()

export const ExpectedGradSchema = z.object({
  term: z.string(),
  year: z.number(),
})

export const OfficerSchema = z.object({
  id: z.string().optional(),
  accessLevel: z.number(),
  expectedGrad: ExpectedGradSchema,
  term: z.string().optional(),
  year: z.number().optional(),
  firstName: z.string(),
  lastName: z.string(),
  netId: z.string(),
  isActive: z.boolean(),
  joinDate: RoleDate,
  UID: z.string().optional(),
  socialLinks: SocialLinksSchema,
  standing: z.string(),
  roles: z.array(RoleSchema),
})

export type Officer = z.infer<typeof OfficerSchema>
