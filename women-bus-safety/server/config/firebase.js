const path = require("path");
const admin = require("firebase-admin");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const serviceAccountPath = path.resolve(
  __dirname,
  "..",
  process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "./serviceaccountkey.json"
);
let serviceAccount = null;
try {
  serviceAccount = require(serviceAccountPath);
} catch (error) {
  console.error("Failed to parse Firebase service account file, falling back to default credentials:", error.message);
}

if (!admin.apps.length) {
  const baseConfig = {
    databaseURL:
      "https://women-bus-safety-default-rtdb.asia-southeast1.firebasedatabase.app",
  };
  if (serviceAccount) {
    admin.initializeApp({
      ...baseConfig,
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    admin.initializeApp(baseConfig);
  }
}

const db = admin.firestore();
const rtdb = admin.database();

module.exports = { admin, db, rtdb };
