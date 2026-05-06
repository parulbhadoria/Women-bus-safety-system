const { rtdb } = require("../config/firebase");

const getActiveBuses = async (_req, res, next) => {
  try {
    const snap = await rtdb.ref("bus_locations").get();
    const value = snap.val() || {};
    const active = Object.entries(value)
      .filter(([, data]) => data && data.isActive)
      .map(([busNumber, data]) => ({ busNumber, ...data }));

    return res.json(active);
  } catch (error) {
    return next(error);
  }
};

module.exports = { getActiveBuses };
