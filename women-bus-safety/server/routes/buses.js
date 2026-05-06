const express = require("express");
const { rtdb } = require("../config/firebase");

const router = express.Router();
router.get("/active", async (_req, res) => {
  try {
    const snapshot = await rtdb.ref("bus_locations").get();
    const value = snapshot.val() || {};
    const active = Object.entries(value)
      .filter(([, data]) => data && data.isActive === true)
      .map(([busNumber, data]) => ({
        busNumber,
        latitude: data.latitude,
        longitude: data.longitude,
        timestamp: data.timestamp,
        driverUid: data.driverUid,
      }));
    return res.json(active);
  } catch {
    return res.status(500).json({ error: "Failed to fetch active buses" });
  }
});

module.exports = router;
