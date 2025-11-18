import admin from "firebase-admin";
import * as path from "path";
import * as fs from "fs";

if (!admin.apps.length) {
  const credsPath = path.resolve(__dirname, "../firebase-creds.json");

  // Check if credentials file exists (Cloud Build will have it)
  if (fs.existsSync(credsPath)) {
    admin.initializeApp({
      credential: admin.credential.cert(credsPath)
    });
  } else {
    // Fallback to default credentials (local dev with env var or Cloud Functions default)
    admin.initializeApp();
  }
}

export const auth = admin.auth();
export const db = admin.firestore();