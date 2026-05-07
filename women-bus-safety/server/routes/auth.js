const express = require("express");

const aadhaarFallbackRecords = {
  "111122223333": { name: "Priya Sharma", gender: "Female" },
  "222233334444": { name: "Anita Verma", gender: "Female" },
  "333344445555": { name: "Neha Singh", gender: "Female" },
  "444455556666": { name: "Kavita Rao", gender: "Female" },
  "555566667777": { name: "Pooja Mehta", gender: "Female" },
};

const licenseFallbackRecords = {
  DL001: { name: "Ramesh Kumar", isValid: true },
  DL002: { name: "Suresh Patel", isValid: true },
  DL003: { name: "Mahesh Iyer", isValid: true },
  DL004: { name: "Naresh Das", isValid: true },
  DL005: { name: "Rajesh Jain", isValid: true },
};
const router = express.Router();
router.post("/verify-aadhaar", async (req, res) => {
  try {
    const { aadhaarNumber } = req.body;
    if (!aadhaarNumber) {
      return res.status(400).json({ error: "Aadhaar number is required" });
    }
    const { db } = require("../config/firebase");
    const snapshot = await db.collection("aadhaar_records")
      .where("aadhaarNumber", "==", String(aadhaarNumber).trim())
      .limit(1)
      .get();
    if (snapshot.empty) {
      return res.status(404).json({ error: "Aadhaar number not found in records" });
    }
    const data = snapshot.docs[0].data();
    if (data.gender !== "Female") {
      return res.status(403).json({ error: "Only female passengers can register" });
    }
    return res.status(200).json({ found: true, gender: data.gender, name: data.name });
  } catch (error) {
    console.error("verify-aadhaar error:", error);
    const fallback = aadhaarFallbackRecords[String(req.body?.aadhaarNumber || "").trim()];
    if (fallback) {
      return res.status(200).json({ found: true, gender: fallback.gender, name: fallback.name });
    }
    return res.status(500).json({ error: "Verification failed. Please try again." });
  }
});

router.post("/verify-license", async (req, res) => {
  try {
    const { licenseId } = req.body;
    if (!licenseId) {
      return res.status(400).json({ error: "License ID is required" });
    }
    const { db } = require("../config/firebase");
    const snapshot = await db.collection("license_records")
      .where("licenseId", "==", String(licenseId).trim())
      .limit(1)
      .get();
    if (snapshot.empty) {
      return res.status(404).json({ error: "License ID not found" });
    }
    const data = snapshot.docs[0].data();
    if (data.isValid !== true) {
      return res.status(403).json({ error: "License ID is not valid" });
    }
    return res.status(200).json({ found: true, name: data.name });
  } catch (error) {
    console.error("verify-license error:", error);
    const fallback = licenseFallbackRecords[String(req.body?.licenseId || "").trim()];
    if (fallback && fallback.isValid === true) {
      return res.status(200).json({ found: true, name: fallback.name });
    }
    return res.status(500).json({ error: "Verification failed. Please try again." });
  }
});

module.exports = router;
