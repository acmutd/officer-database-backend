import { db } from "../firebase";
import { validateOfficerData } from "./helpers/validators";

const COLLECTION = "officer";

export async function createOfficer(data: any) {
	const parsed = validateOfficerData(data);

	const officerRef = db.collection(COLLECTION);
	await officerRef.doc(parsed.id).set(parsed);

	return parsed;
}
