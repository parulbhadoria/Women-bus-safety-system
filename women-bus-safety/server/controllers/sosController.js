const { admin, db } = require("../config/firebase");

const createSos = async (req, res, next) => {
  try {
    const payload = req.body;
    const ref = db.collection("sos_alerts").doc();
    await ref.set({
      alertId: ref.id,
      userId: payload.userId,
      passengerName: payload.passengerName,
      busNumber: payload.busNumber,
      latitude: payload.latitude,
      longitude: payload.longitude,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      emergencyContactEmail: payload.emergencyContactEmail,
      status: payload.status || "sent",
      locationLink: payload.locationLink,
    });
    res.status(201).json({ success: true, alertId: ref.id });
  } catch (error) {
    next(error);
  }
};

module.exports = { createSos };
