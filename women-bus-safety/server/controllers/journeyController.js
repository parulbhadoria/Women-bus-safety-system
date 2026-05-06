const { admin, db } = require("../config/firebase");

const startJourney = async (req, res, next) => {
  try {
    const payload = req.body;
    const journeyRef = db.collection("journeys").doc();
    await journeyRef.set({
      journeyId: journeyRef.id,
      passengerId: payload.passengerId,
      busNumber: payload.busNumber,
      source: payload.source || "Unknown",
      destination: payload.destination || "Unknown",
      boardingTime: admin.firestore.FieldValue.serverTimestamp(),
      completionTime: null,
      status: "active",
    });
    res.status(201).json({ journeyId: journeyRef.id });
  } catch (error) {
    next(error);
  }
};

const completeJourney = async (req, res, next) => {
  try {
    const { journeyId, busNumber } = req.body;
    await db.collection("journeys").doc(journeyId).update({
      status: "completed",
      completionTime: admin.firestore.FieldValue.serverTimestamp(),
    });
    const busSnap = await db
      .collection("buses")
      .where("busNumber", "==", busNumber)
      .limit(1)
      .get();
    if (!busSnap.empty) {
      await busSnap.docs[0].ref.update({
        femalePassengerCount: admin.firestore.FieldValue.increment(-1),
      });
    }
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
};

module.exports = { startJourney, completeJourney };
