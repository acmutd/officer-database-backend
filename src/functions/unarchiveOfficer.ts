import { Request, Response } from "@google-cloud/functions-framework";
import { db } from "../firebase";
import { validateRequest } from "../middleware";

export const unarchiveOfficer = validateRequest(async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.query.id as string;

    if (!id) {
      res.status(400).json({ error: "Officer ID is required" });
      return;
    }

    const activeRef = db.collection("officer").doc(id);
    const archivedRef = db.collection("archived").doc(id);

    await db.runTransaction(async (tx) => {
      const archivedDoc = await tx.get(archivedRef);
      if (!archivedDoc.exists) {
        throw Object.assign(new Error("Archived officer not found"), { status: 404 });
      }

      const activeDoc = await tx.get(activeRef);
      if (activeDoc.exists) {
        throw Object.assign(new Error("Officer already active"), { status: 409 });
      }

      const officerData = archivedDoc.data();
      tx.set(activeRef, officerData);
      tx.delete(archivedRef);
    });

    const result = await activeRef.get();
    res.status(200).json({ id, ...result.data() });
  } catch (error: any) {
    const status = typeof error?.status === 'number' ? error.status : 500;
    res.status(status).json({
      error: error instanceof Error ? error.message : 'Server error'
    });
  }
});
