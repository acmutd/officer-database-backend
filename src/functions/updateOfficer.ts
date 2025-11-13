import { Request, Response } from "@google-cloud/functions-framework";
import { db } from "../firebase";
import { validateRequest } from "../middleware";
import { validateOfficerData } from "../helpers/validators";

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

    // Validate the updated data
    const parsed = validateOfficerData({ ...req.body, id });

    // Remove id from the data to update (we don't want to update the id field)
    const { id: _, ...updateData } = parsed as any;

    await officerRef.update(updateData);

    res.status(200).json(updateData);
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Invalid request'
    });
  }
});