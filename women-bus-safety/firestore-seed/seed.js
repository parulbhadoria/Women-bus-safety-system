const path = require("path");
const admin = require("firebase-admin");

const serviceAccount = require(path.resolve(
  __dirname,
  "../server/serviceaccountkey.json"
));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://women-bus-safety-default-rtdb.asia-southeast1.firebasedatabase.app",
});

const db = admin.firestore();
//simulated db
const run = async () => {
  const aadhaarRecords = [
    { aadhaarNumber: "111122223333", name: "Priya Sharma", gender: "Female", dob: "1998-05-10" },
    { aadhaarNumber: "222233334444", name: "Neha Gupta", gender: "Female", dob: "2000-03-22" },
    { aadhaarNumber: "333344445555", name: "Anjali Singh", gender: "Female", dob: "1997-11-15" },
    { aadhaarNumber: "444455556666", name: "Ritu Verma", gender: "Female", dob: "2001-07-08" },
    { aadhaarNumber: "555566667777", name: "Kavya Reddy", gender: "Female", dob: "1999-01-30" },
  ];
  const licenseRecords = [
    { licenseId: "DL001", name: "Ramesh Kumar", isValid: true },
    { licenseId: "DL002", name: "Suresh Patel", isValid: true },
    { licenseId: "DL003", name: "Mahesh Yadav", isValid: true },
    { licenseId: "DL004", name: "Dinesh Singh", isValid: true },
    { licenseId: "DL005", name: "Rakesh Sharma", isValid: true },
  ];
  const buses = [
    { busNumber: "BUS101", assignedDriverUid: "", femalePassengerCount: 0, isActive: false },
    { busNumber: "BUS102", assignedDriverUid: "", femalePassengerCount: 0, isActive: false },
    { busNumber: "BUS103", assignedDriverUid: "", femalePassengerCount: 0, isActive: false },
  ];

  for (const item of aadhaarRecords) await db.collection("aadhaar_records").doc(item.aadhaarNumber).set(item);
  for (const item of licenseRecords) await db.collection("license_records").doc(item.licenseId).set(item);
  for (const item of buses) await db.collection("buses").doc(item.busNumber).set(item);

  await db.collection("app_config").doc("config").set({ thresholdDistance: 500 });
  await db.collection("users").doc("admin001").set({
    uid: "admin001",
    name: "Admin User",
    email: "admin@womenbus.com",
    role: "admin",
    phone: "",
    emergencyContacts: [],
  });

  console.log("Firestore seed completed");
  process.exit(0);
};

run().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exit(1);
});
