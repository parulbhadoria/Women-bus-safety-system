const express = require("express");
const { db } = require("../config/firebase");

const router = express.Router();
router.post("/verify-aadhaar", async (req, res) => {
  try {
    const { aadhaarNumber } = req.body || {};
    if (!aadhaarNumber) return res.status(400).json({ error: "Aadhaar number is required" });
    const snap = await db.collection("aadhaar_records").where("aadhaarNumber", "==", String(aadhaarNumber)).limit(1).get();
    if (snap.empty) return res.status(404).json({ error: "Aadhaar number not found in records" });
    const data = snap.docs[0].data();
    return res.json({ found: true, gender: data.gender, name: data.name });
  } catch {
    return res.status(500).json({ error: "Failed to verify Aadhaar right now" });
  }
});

router.post("/verify-license", async (req, res) => {
  try {
    const { licenseId } = req.body || {};
    if (!licenseId) return res.status(400).json({ error: "License ID is required" });
    const snap = await db.collection("license_records").where("licenseId", "==", String(licenseId)).where("isValid", "==", true).limit(1).get();
    if (snap.empty) return res.status(404).json({ error: "License ID not found" });
    const data = snap.docs[0].data();
    return res.json({ found: true, name: data.name });
  } catch {
    return res.status(500).json({ error: "Failed to verify license right now" });
  }
});

module.exports = router;
