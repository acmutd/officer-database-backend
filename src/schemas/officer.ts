import { z } from 'zod'

export const TermEnum = z.enum(['Fall', 'Spring', 'Summer'])

export const StandingEnum = z.enum(['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate', 'Alumni'])

export const DivisionEnum = z.enum(['Media', 'Research', 'Development', 'Projects', 'Executive', 'Education', 'Community', 'HackUTD', 'Industry'])

export const SimpleDate = z.object({
  term: TermEnum,
  year: z.number().int(),
})

export const RoleSchema = z.object({
  title: z.string(),
  division: DivisionEnum,
  level: z.number(),
  startDate: SimpleDate,
  endDate: SimpleDate.nullable(),
})

export const SocialLinksSchema = z.object({
  personalEmail: z.string().optional(),
  linkedin: z.string().optional(),
  github: z.string().optional(),
})

export const OfficerSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  netId: z.string(),
  accessLevel: z.number(),
  isActive: z.boolean(),
  standing: StandingEnum,
  expectedGrad: SimpleDate,
  joinDate: SimpleDate,
  socialLinks: SocialLinksSchema,
  roles: z.array(RoleSchema),
})

export type Officer = z.infer<typeof OfficerSchema>
