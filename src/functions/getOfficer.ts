import { Request, Response } from "@google-cloud/functions-framework";
import { db, storage } from "../firebase";
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

    const officerData = officerDoc.data();

    // Refresh signed URLs if they exist
    const bucketName = 'acm-officer-database.firebasestorage.app';
    const bucket = storage.bucket(bucketName);

    if (officerData?.resume) {
      try {
        const resumeFile = bucket.file(`resumes/${id}`);
        const [signedResumeUrl] = await resumeFile.getSignedUrl({
          version: 'v4',
          action: 'read',
          expires: Date.now() + 3 * 24 * 60 * 60 * 1000, // 3 days
        });
        officerData.resume = signedResumeUrl;
      } catch (error) {
        console.warn('Error generating signed URL for resume:', error);
      }
    }

    res.status(200).json({
      id: officerDoc.id,
      ...officerData
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Server error'
    });
  }
});