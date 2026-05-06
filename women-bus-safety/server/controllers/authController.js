const { db } = require("../config/firebase");

const verifyAadhaar = async (req, res, next) => {
  try {
    const { aadhaarNumber } = req.body;
    const snap = await db
      .collection("aadhaar_records")
      .where("aadhaarNumber", "==", aadhaarNumber)
      .limit(1)
      .get();

    if (snap.empty) {
      return res.status(404).json({ error: "Aadhaar number not found" });
    }

    const record = snap.docs[0].data();
    return res.json({ found: true, gender: record.gender, name: record.name });
  } catch (error) {
    return next(error);
  }
};

const verifyLicense = async (req, res, next) => {
  try {
    const { licenseId } = req.body;
    const snap = await db
      .collection("license_records")
      .where("licenseId", "==", licenseId)
      .limit(1)
      .get();

    if (snap.empty) {
      return res.status(404).json({ error: "License ID not found" });
    }
    const record = snap.docs[0].data();
    if (!record.isValid) {
      return res.status(400).json({ error: "License is not valid" });
    }
    return res.json({ found: true, name: record.name });
  } catch (error) {
    return next(error);
  }
};

module.exports = { verifyAadhaar, verifyLicense };
