const path = require("path");
const admin = require("firebase-admin");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const serviceAccountPath = path.resolve(
  __dirname,
  "..",
  process.env.FIREBASE_SERVICE_ACCOUNT_PATH || "./serviceaccountkey.json"
);
const serviceAccount = require(serviceAccountPath);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL:
      "https://women-bus-safety-default-rtdb.asia-southeast1.firebasedatabase.app",
  });
}

const db = admin.firestore();
const rtdb = admin.database();

module.exports = { admin, db, rtdb };
