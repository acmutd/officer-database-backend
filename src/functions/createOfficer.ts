import { Request, Response } from "@google-cloud/functions-framework";
import { db } from "../firebase";
import { validateRequest } from "../middleware";
import { validateOfficerData } from "../helpers/validators";

export const createOfficer = validateRequest(async (req: Request, res: Response): Promise<void> => {
	try {
		const parsed = validateOfficerData(req.body);

		const officerRef = db.collection("officer");
		await officerRef.doc(parsed.id).set(parsed);

		res.status(201).json(parsed);
	} catch (error) {
		res.status(400).json({
			error: error instanceof Error ? error.message : 'Invalid request'
		});
	}
});