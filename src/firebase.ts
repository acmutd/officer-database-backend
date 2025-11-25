import admin from "firebase-admin";
import * as fs from "fs";

if (!admin.apps.length) {
  try {
    let credentialsJson;

    // Try local firebase-creds.json first (created during Cloud Build)
    if (fs.existsSync('firebase-creds.json')) {
      credentialsJson = JSON.parse(fs.readFileSync('firebase-creds.json', 'utf-8'));
      admin.initializeApp({
        credential: admin.credential.cert(credentialsJson),
        storageBucket: `${credentialsJson.project_id}.appspot.com`
      });
      console.log('Firebase initialized with local firebase-creds.json');
    }
    // Try Cloud Functions mounted secret path
    else if (process.env.FIREBASE_CREDS && fs.existsSync(`/run/secrets/${process.env.FIREBASE_CREDS}`)) {
      credentialsJson = JSON.parse(fs.readFileSync(`/run/secrets/${process.env.FIREBASE_CREDS}`, 'utf-8'));
      admin.initializeApp({
        credential: admin.credential.cert(credentialsJson),
        storageBucket: `${credentialsJson.project_id}.appspot.com`
      });
      console.log('Firebase initialized with Secret Manager credentials');
    }
    // Fallback: use Application Default Credentials
    else {
      admin.initializeApp({
        storageBucket: 'acm-officer-database.appspot.com'
      });
      console.log('Firebase initialized with Application Default Credentials');
    }
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    // Final fallback to Application Default Credentials
    admin.initializeApp({
      storageBucket: 'acm-officer-database.appspot.com'
    });
  }
}

export const auth = admin.auth();
export const db = admin.firestore();
export const storage = admin.storage();