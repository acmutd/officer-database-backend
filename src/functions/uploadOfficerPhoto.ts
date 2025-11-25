import { Request, Response } from "@google-cloud/functions-framework";
import { db, storage } from "../firebase";
import { validateRequest } from "../middleware";

// Expects JSON body: { id: string, imageBase64: string, contentType?: string }
export const uploadOfficerPhoto = validateRequest(async (req: Request, res: Response): Promise<void> => {
  try {
    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }

    const { id, imageBase64, contentType } = req.body || {};

    if (!id || !imageBase64) {
      res.status(400).json({ error: 'id and imageBase64 are required in JSON body' });
      return;
    }

    // Validate officer exists
    const officerDoc = await db.collection('officer').doc(id).get();
    if (!officerDoc.exists) {
      res.status(404).json({ error: 'Officer not found' });
      return;
    }

    let buffer: Buffer;
    try {
      buffer = Buffer.from(imageBase64, 'base64');
    } catch {
      res.status(400).json({ error: 'Invalid base64 data' });
      return;
    }

    // Try the new Firebase Storage bucket naming convention first
    const bucketName = 'acm-officer-database.firebasestorage.app';
    const bucket = storage.bucket(bucketName);
    const filePath = `officers/${id}`; // extension optional; rely on contentType
    const file = bucket.file(filePath);

    await file.save(buffer, {
      contentType: contentType || 'image/jpeg',
      resumable: false,
      public: true,
      metadata: {
        cacheControl: 'public,max-age=31536000'
      }
    });

    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;

    await db.collection('officer').doc(id).set({ photoUrl: publicUrl, photoUpdatedAt: new Date().toISOString() }, { merge: true });

    res.status(200).json({ id, photoUrl: publicUrl });
  } catch (error) {
    console.error('uploadOfficerPhoto error', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});