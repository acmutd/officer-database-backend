import { Request, Response } from "@google-cloud/functions-framework";
import { db } from "../firebase";
import { validateRequest } from "../middleware";

export const getOfficer = validateRequest(async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.query.id as string;

    if (!id) {
      res.status(400).json({ error: "Officer ID is required" });
      return;
    }

    const officerDoc = await db.collection("officer").doc(id).get();

    if (!officerDoc.exists) {
      res.status(404).json({ error: "Officer not found" });
      return;
    }

    res.status(200).json({
      id: officerDoc.id,
      ...officerDoc.data()
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Server error'
    });
  }
});