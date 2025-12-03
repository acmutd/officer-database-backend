import { Request, Response } from "@google-cloud/functions-framework";
import { storage } from "../firebase";
import { validateRequest } from "../middleware";

export const getOfficerResume = validateRequest(async (req: Request, res: Response): Promise<void> => {
  try {
    // Set CORS headers
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    const id = req.query.id as string;

    if (!id) {
      res.status(400).json({ error: "Officer ID is required" });
      return;
    }

    const bucketName = 'acm-officer-database.firebasestorage.app';
    const bucket = storage.bucket(bucketName);
    const resumeFile = bucket.file(`resumes/${id}`);

    // Check if file exists
    const [exists] = await resumeFile.exists();
    if (!exists) {
      res.status(404).json({ error: "Resume not found for this officer" });
      return;
    }

    // Generate signed URL (valid for 3 days)
    const [signedUrl] = await resumeFile.getSignedUrl({
      version: 'v4',
      action: 'read',
      expires: Date.now() + 3 * 24 * 60 * 60 * 1000, // 3 days
    });

    res.status(200).json({ id, resumeUrl: signedUrl });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Server error'
    });
  }
});
