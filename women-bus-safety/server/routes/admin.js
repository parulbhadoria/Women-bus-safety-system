const express = require("express");
const { db } = require("../config/firebase");

const router = express.Router();
router.get("/buses", async (_req, res) => {
  try {
    const snap = await db.collection("buses").get();
    return res.json(snap.docs.map((d) => d.data()));
  } catch {
    return res.status(500).json({ error: "Failed to fetch buses" });
  }
});

router.get("/drivers", async (_req, res) => {
  try {
    const snap = await db.collection("drivers").get();
    return res.json(snap.docs.map((d) => d.data()));
  } catch {
    return res.status(500).json({ error: "Failed to fetch drivers" });
  }
});

router.get("/passengers", async (_req, res) => {
  try {
    const snap = await db.collection("users").where("role", "==", "passenger").get();
    return res.json(snap.docs.map((d) => d.data()));
  } catch {
    return res.status(500).json({ error: "Failed to fetch passengers" });
  }
});

router.get("/sos-alerts", async (_req, res) => {
  try {
    const snap = await db.collection("sos_alerts").orderBy("timestamp", "desc").get();
    return res.json(snap.docs.map((d) => d.data()));
  } catch {
    return res.status(500).json({ error: "Failed to fetch SOS alerts" });
  }
});

router.post("/assign-bus", async (req, res) => {
  try {
    const { driverUid, busNumber } = req.body;

    if (!driverUid || !busNumber) {
      return res.status(400).json({ error: "driverUid and busNumber are required" });
    }

    const { db } = require("../config/firebase");

    const driversSnapshot = await db.collection("drivers")
      .where("uid", "==", driverUid)
      .limit(1)
      .get();

    if (driversSnapshot.empty) {
      return res.status(404).json({ error: "Driver not found" });
    }

    const driverDocRef = driversSnapshot.docs[0].ref;
    await driverDocRef.update({ assignedBus: busNumber });

    const busesSnapshot = await db.collection("buses")
      .where("busNumber", "==", busNumber)
      .limit(1)
      .get();

    if (busesSnapshot.empty) {
      return res.status(404).json({ error: "Bus not found" });
    }

    const busDocRef = busesSnapshot.docs[0].ref;
    await busDocRef.update({ assignedDriverUid: driverUid });

    return res.status(200).json({ success: true, message: "Bus assigned successfully" });
  } catch (error) {
    console.error("Assign bus error:", error);
    return res.status(500).json({ error: "Failed to assign bus. Please try again." });
  }
});

module.exports = router;
