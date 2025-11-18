import admin from "firebase-admin";

if (!admin.apps.length) {
  // Check if running in Cloud Functions with secret
  if (process.env.FIREBASE_CREDS) {
    try {
      const serviceAccount = JSON.parse(process.env.FIREBASE_CREDS);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } catch (error) {
      console.error('Failed to parse FIREBASE_CREDS:', error);
      // Fallback to default credentials
      admin.initializeApp();
    }
  } else {
    // Local development or default credentials
    admin.initializeApp();
  }
}

export const auth = admin.auth();
export const db = admin.firestore();