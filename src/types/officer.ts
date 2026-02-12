import { z } from "zod";

export const StandingSchema = z.enum([
	"Freshman",
	"Sophomore",
	"Junior",
	"Senior",
	"Graduate",
	"Alumni",
]);

export const DivisionEnum = z.enum([
	"Media",
	"Research",
	"Development",
	"Projects",
	"Education",
	"Executive",
	"Community",
	"HackUTD",
	"Industry",
	"Finance",
]);

export const SocialLinksSchema = z.object({
	linkedin: z.string().url().optional(),
	github: z.string().url().optional(),
	instagram: z.string().url().optional(),
	personalEmail: z.string().email().optional(),
});

export const TermSchema = z.object({
	term: z.enum(["Fall", "Spring", "Summer"]),
	year: z.number().int().min(2020),
});

export const InternshipsSchema = z.object({
	title: z.string().min(1),
	company: z.string().min(1),
	startDate: z.string().min(1),
	endDate: z.string().optional(),
});

export const ResearchSchema = z.object({
	title: z.string().min(1),
	lab: z.string().min(1),
	principalInvestigator: z.array(z.string().min(1)),
	startDate: z.string().min(1),
	endDate: z.string().optional(),
});

export const RoleSchema = z.object({
	title: z.string().min(1),
	division: DivisionEnum,
	level: z.number().int().min(1).max(3),
	startDate: TermSchema,
	endDate: TermSchema.nullable(),
});

export const PhotoSchema = z.object({
	url: z.string().url().optional(),
	lastUpdatedAt: z.string().optional(),
});

export const OfficerSchema = z.object({
	id: z.string().min(1),
	firstName: z.string().min(1),
	lastName: z.string().min(1),
	netId: z.string().min(1),
	photo: PhotoSchema,
	resumeUpdatedAt: z.string().optional(),
	socialLinks: SocialLinksSchema,
	creditStanding: StandingSchema,
	yearStanding: StandingSchema,
	expectedGrad: TermSchema,
	internships: z.array(InternshipsSchema),
	research: z.array(ResearchSchema),
	joinDate: TermSchema,
	roles: z.array(RoleSchema),
	accessLevel: z.number().int().min(1).max(3),
	isActive: z.boolean(),
	isArchived: z.boolean(),
});

export type Officer = z.infer<typeof OfficerSchema>;