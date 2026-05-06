const express = require("express");
const { admin, db } = require("../config/firebase");

const router = express.Router();
router.post("/start", async (req, res) => {
  try {
    const { passengerId, busNumber, source, destination } = req.body || {};
    if (!passengerId || !busNumber) return res.status(400).json({ error: "passengerId and busNumber are required" });
    const ref = db.collection("journeys").doc();
    await ref.set({
      journeyId: ref.id,
      passengerId,
      busNumber,
      source: source || "Current Location",
      destination: destination || "Destination",
      boardingTime: admin.firestore.FieldValue.serverTimestamp(),
      completionTime: null,
      status: "active",
    });
    return res.json({ journeyId: ref.id });
  } catch {
    return res.status(500).json({ error: "Failed to start journey" });
  }
});

router.post("/complete", async (req, res) => {
  try {
    const { journeyId, busNumber } = req.body || {};
    if (!journeyId || !busNumber) return res.status(400).json({ error: "journeyId and busNumber are required" });
    await db.collection("journeys").doc(journeyId).update({
      status: "completed",
      completionTime: admin.firestore.FieldValue.serverTimestamp(),
    });
    await db.collection("buses").doc(busNumber).update({
      femalePassengerCount: admin.firestore.FieldValue.increment(-1),
    });
    return res.json({ success: true });
  } catch {
    return res.status(500).json({ error: "Failed to complete journey" });
  }
});

module.exports = router;
