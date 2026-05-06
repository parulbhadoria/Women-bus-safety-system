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
    const { driverUid, busNumber } = req.body || {};
    if (!driverUid || !busNumber) return res.status(400).json({ error: "driverUid and busNumber are required" });
    await db.collection("drivers").doc(driverUid).update({ assignedBus: busNumber });
    await db.collection("buses").doc(busNumber).update({ assignedDriverUid: driverUid });
    return res.json({ success: true });
  } catch {
    return res.status(500).json({ error: "Failed to assign bus" });
  }
});

module.exports = router;
