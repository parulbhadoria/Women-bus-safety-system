const { db } = require("../config/firebase");

const getBuses = async (_req, res, next) => {
  try {
    const snap = await db.collection("buses").get();
    res.json(snap.docs.map((d) => d.data()));
  } catch (error) {
    next(error);
  }
};

const getDrivers = async (_req, res, next) => {
  try {
    const snap = await db.collection("drivers").get();
    res.json(snap.docs.map((d) => d.data()));
  } catch (error) {
    next(error);
  }
};

const getPassengers = async (_req, res, next) => {
  try {
    const snap = await db.collection("users").where("role", "==", "passenger").get();
    res.json(snap.docs.map((d) => d.data()));
  } catch (error) {
    next(error);
  }
};

const getSosAlerts = async (_req, res, next) => {
  try {
    const snap = await db.collection("sos_alerts").orderBy("timestamp", "desc").get();
    res.json(snap.docs.map((d) => d.data()));
  } catch (error) {
    next(error);
  }
};

const assignBus = async (req, res, next) => {
  try {
    const { driverUid, busNumber } = req.body;
    const driverRef = db.collection("drivers").doc(driverUid);
    await driverRef.update({ assignedBus: busNumber });
    const busSnap = await db
      .collection("buses")
      .where("busNumber", "==", busNumber)
      .limit(1)
      .get();
    if (busSnap.empty) return res.status(404).json({ error: "Bus not found" });
    await busSnap.docs[0].ref.update({ assignedDriverUid: driverUid });
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = { getBuses, getDrivers, getPassengers, getSosAlerts, assignBus };
