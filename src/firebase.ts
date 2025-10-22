import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";

const serviceAccount = require("../firebase-creds.json");

initializeApp({
	credential: cert(serviceAccount),
});

export const db = getFirestore();
export const auth = getAuth();
