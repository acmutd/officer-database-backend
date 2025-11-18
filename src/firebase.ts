import admin from "firebase-admin";
import * as fs from "fs";

if (!admin.apps.length) {
  try {
    // Cloud Functions mounts secrets as files at /run/secrets/SECRET_NAME
    const secretPath = process.env.FIREBASE_CREDS ? `/run/secrets/${process.env.FIREBASE_CREDS}` : null;

    if (secretPath && fs.existsSync(secretPath)) {
      // Production: read from Secret Manager
      const credentialsJson = JSON.parse(fs.readFileSync(secretPath, 'utf-8'));
      admin.initializeApp({
        credential: admin.credential.cert(credentialsJson)
      });
      console.log('Firebase initialized with Secret Manager credentials');
    } else {
      // Development/fallback: use Application Default Credentials
      admin.initializeApp();
      console.log('Firebase initialized with Application Default Credentials');
    }
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    // Final fallback to Application Default Credentials
    admin.initializeApp();
  }
}

export const auth = admin.auth();
export const db = admin.firestore();