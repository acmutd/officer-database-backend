import { OfficerSchema } from "../../schemas/officer";

export function validateOfficerData(data: any) {
	const parsed = OfficerSchema.safeParse(data);
	if (!parsed.success) {
		const err: any = new Error("Validation failed");
		err.status = 400;
		err.errors = parsed.error.flatten();
		throw err;
	}
	return parsed.data;
}

export function validateOfficerPatch(data: any) {
	const PatchSchema = OfficerSchema.partial();
	const parsed = PatchSchema.safeParse(data);
	if (!parsed.success) {
		const err: any = new Error("Validation failed");
		err.status = 400;
		err.errors = parsed.error.flatten();
		throw err;
	}
	return parsed.data;
}