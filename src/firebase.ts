import admin from "firebase-admin";
import * as path from "path";

if (!admin.apps.length) {
  if (process.env.NODE_ENV === 'development' || !process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp({
      credential: admin.credential.cert(
        path.resolve(__dirname, '../firebase-creds.json')
      )
    });
  } else {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }
}

export const auth = admin.auth();
export const db = admin.firestore();