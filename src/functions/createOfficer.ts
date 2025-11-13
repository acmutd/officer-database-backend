import { Request, Response } from "express";
import { db } from "../firebase";
import { validateRequest } from "../middleware";
import { validateOfficerData } from "../helpers/validators";

export const createOfficer = [validateRequest, async (req: Request, res: Response) => {
	const parsed = validateOfficerData(req.body);

	const officerRef = db.collection("officer");
	await officerRef.doc(parsed.id).set(parsed);

	const { id, ...body } = parsed as any;
	return res.status(201).json(body);
}];