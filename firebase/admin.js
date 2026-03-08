import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

let credentialSettings;

// Check if we have the private key string in env vars
if (process.env.FIREBASE_PRIVATE_KEY) {
  // Replace literal '\n' with actual newlines and remove surrounding quotes if Vercel added them
  let privateKeyStr = process.env.FIREBASE_PRIVATE_KEY;
  if (privateKeyStr.startsWith('"') && privateKeyStr.endsWith('"')) {
    privateKeyStr = privateKeyStr.slice(1, -1);
  }
  const privateKey = privateKeyStr.replace(/\\n/g, "\n");

  credentialSettings = admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: privateKey,
  });
} else {
  // Check for required env vars and log helpful error
  console.error("Firebase Admin initialization failed!");
  console.error("Missing required environment variables:");
  if (!process.env.FIREBASE_PROJECT_ID)
    console.error("  - FIREBASE_PROJECT_ID");
  if (!process.env.FIREBASE_CLIENT_EMAIL)
    console.error("  - FIREBASE_CLIENT_EMAIL");
  if (!process.env.FIREBASE_PRIVATE_KEY)
    console.error("  - FIREBASE_PRIVATE_KEY");
  console.error(
    "Please add these in Vercel Project Settings > Environment Variables",
  );
  console.error("See FIREBASE_SETUP.md for instructions.");

  // Fallback to application default credentials if available (for local dev)
  try {
    credentialSettings = admin.credential.applicationDefault();
    console.log("Using Application Default Credentials (ADC)");
  } catch (adcError) {
    console.error("Could not initialize Firebase Admin SDK");
    throw new Error(
      "Firebase Admin initialization failed. Check environment variables.",
    );
  }
}

try {
  admin.initializeApp({
    credential: credentialSettings,
  });

  // Test the connection
  admin
    .auth()
    .listUsers(1)
    .then(() => console.log("Firebase Admin initialized successfully"))
    .catch((err) => {
      console.warn(
        "Firebase Admin initialized but may have limited access:",
        err.message,
      );
    });
} catch (error) {
  console.error("Firebase Admin initialization error:", error.message);
  throw error;
}

export const db = admin.firestore();
export const auth = admin.auth();
