import { Request, Response } from "@google-cloud/functions-framework";
import { db } from "../firebase";
import { validateRequest } from "../middleware";
import { validateOfficerPatch } from "../helpers/validators";

export const updateOfficer = validateRequest(async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.query.id as string;

    if (!id) {
      res.status(400).json({ error: "Officer ID is required" });
      return;
    }

    const collection = req.query.archived === 'true' ? 'archived' : 'officer';
    const officerRef = db.collection(collection).doc(id);
    const officerDoc = await officerRef.get();

    if (!officerDoc.exists) {
      res.status(404).json({ error: "Officer not found" });
      return;
    }

    // Validate the partial update data
    const parsed = validateOfficerPatch(req.body);

    const { id: _, ...updateData } = parsed as any;

    await officerRef.update(updateData);

    const updatedDoc = await officerRef.get();
    res.status(200).json(updatedDoc.data());
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Invalid request'
    });
  }
});