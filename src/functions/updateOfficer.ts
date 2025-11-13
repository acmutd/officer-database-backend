import { Request, Response } from "@google-cloud/functions-framework";
import { db } from "../firebase";
import { validateRequest } from "../middleware";
import { validateOfficerPatch } from "../helpers/validators";

export const updateOfficer = validateRequest(async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "Officer ID is required" });
    }

    const officerRef = db.collection("officer").doc(id);
    const officerDoc = await officerRef.get();

    if (!officerDoc.exists) {
      res.status(404).json({ error: "Officer not found" });
    }

    // Validate the partial update data
    const parsed = validateOfficerPatch(req.body);

    await officerRef.update(parsed);

    const updated = await officerRef.get();
    res.status(200).json(updated.data());
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Invalid request'
    });
  }
});