import { Request, Response } from "@google-cloud/functions-framework";
import { db } from "../firebase";
import { validateRequest } from "../middleware";

export const getOfficers = validateRequest(async (req: Request, res: Response): Promise<void> => {
  try {
    // Get limit parameter (default 50, max 100)
    const pageSize = Math.min(Math.max(parseInt(req.query.limit as string) || 50, 1), 100);

    const snapshot = await db.collection("officer").limit(pageSize).get();

    const officers = snapshot.docs.map(doc => doc.data());

    res.status(200).json(officers);
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Server error'
    });
  }
});