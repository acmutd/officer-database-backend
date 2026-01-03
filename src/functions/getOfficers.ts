import { Request, Response } from "@google-cloud/functions-framework";
import { db } from "../firebase";
import { validateRequest } from "../middleware";

export const getOfficers = validateRequest(async (req: Request, res: Response): Promise<void> => {
  try {
    const collection = req.query.archived === 'true' ? 'archived' : 'officer';
    const snapshot = await db.collection(collection).get();

    const officers = snapshot.docs.map(doc => doc.data());

    res.status(200).json(officers);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Server error'
    });
  }
});