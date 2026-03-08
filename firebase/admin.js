import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

try {
  let credentialSettings;

  // Check if we have the private key string in env vars
  if (process.env.FIREBASE_PRIVATE_KEY) {
    // Replace literal '\n' with actual newlines
    const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
    
    credentialSettings = admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey
    });
  } else {
    // Fallback to application default credentials if available
    credentialSettings = admin.credential.applicationDefault();
  }

  admin.initializeApp({
    credential: credentialSettings
  });
  
  console.log('Firebase Admin initialized successfully');
} catch (error) {
  console.error('Firebase Admin initialization error', error.stack);
}

export const db = admin.firestore();
export const auth = admin.auth();
