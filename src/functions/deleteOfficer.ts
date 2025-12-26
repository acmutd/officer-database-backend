import { Request, Response } from "@google-cloud/functions-framework";
import { db } from "../firebase";
import { validateRequest } from "../middleware";

export const deleteOfficer = validateRequest(async (req: Request, res: Response): Promise<void> => {
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

    await officerRef.delete();

    res.status(200).json({ message: "Officer deleted successfully" });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Server error'
    });
  }
});