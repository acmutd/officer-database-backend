import { Request, Response } from "@google-cloud/functions-framework";
import { db, storage } from "../firebase";
import Busboy from "busboy";
import { validateRequest } from "../middleware";

// Requires multipart/form-data with fields: id (string) and file (PDF file)
export const uploadOfficerResume = validateRequest(async (req: Request, res: Response): Promise<void> => {
  try {
    // Set CORS headers
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    if (req.method !== 'POST') {
      res.status(405).json({ error: 'Method Not Allowed' });
      return;
    }

    const contentType = req.headers['content-type'];
    if (!contentType || !contentType.includes('multipart/form-data')) {
      res.status(400).json({ error: 'Content-Type must be multipart/form-data' });
      return;
    }

    // 5MB file size limit
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

    const busboy = Busboy({
      headers: req.headers,
      limits: {
        fileSize: MAX_FILE_SIZE,
        files: 1 // Only allow 1 file
      }
    });

    let officerId: string | null = null;
    let fileBuffer: Buffer | null = null;
    let fileContentType: string | null = null;
    let fileName: string | null = null;
    let fileTooLarge = false;

    // Process form fields
    busboy.on('field', (fieldname: string, val: string) => {
      if (fieldname === 'id') {
        officerId = val;
      }
    });

    // Process the uploaded file
    busboy.on('file', (fieldname: string, file: NodeJS.ReadableStream, info: { filename: string; encoding: string; mimeType: string }) => {
      if (fieldname === 'file') {
        fileName = info.filename;
        fileContentType = info.mimeType;

        const chunks: Buffer[] = [];

        file.on('limit', () => {
          fileTooLarge = true;
          file.resume(); // Drain the file stream
        });

        file.on('data', (chunk: Buffer) => {
          if (!fileTooLarge) {
            chunks.push(chunk);
          }
        });

        file.on('end', () => {
          if (!fileTooLarge) {
            fileBuffer = Buffer.concat(chunks);
          }
        });
      } else {
        // Ignore other files
        file.resume();
      }
    });

    // Handle completion
    busboy.on('finish', async () => {
      try {
        // Validate required fields
        if (!officerId) {
          res.status(400).json({ error: 'id field is required' });
          return;
        }

        if (fileTooLarge) {
          res.status(400).json({ error: 'File size exceeds 10MB limit' });
          return;
        }

        if (!fileBuffer) {
          res.status(400).json({ error: 'file upload is required' });
          return;
        }

        // Validate officer exists
        const officerDoc = await db.collection('officer').doc(officerId).get();
        if (!officerDoc.exists) {
          res.status(404).json({ error: 'Officer not found' });
          return;
        }

        // Upload to Firebase Storage
        const bucketName = 'acm-officer-database.firebasestorage.app';
        const bucket = storage.bucket(bucketName);
        const filePath = `resumes/${officerId}`;
        const file = bucket.file(filePath);

        await file.save(fileBuffer, {
          contentType: fileContentType || 'application/pdf',
          resumable: false,
          public: true,
          metadata: {
            cacheControl: 'public,max-age=31536000'
          }
        });

        const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filePath}`;

        // Update officer document with photo URL
        await db.collection('officer').doc(officerId).set(
          { photoUrl: publicUrl, photoUpdatedAt: new Date().toISOString() },
          { merge: true }
        );

        res.status(200).json({ id: officerId, photoUrl: publicUrl });
      } catch (error) {
        console.error('uploadOfficerPhoto error during processing', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    });

    // Handle errors
    busboy.on('error', (error: Error) => {
      console.error('Busboy error', error);
      res.status(400).json({ error: 'Error parsing multipart/form-data' });
    });

    // Start processing the request
    busboy.end(req.rawBody);
  } catch (error) {
    console.error('uploadOfficerResume error', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});