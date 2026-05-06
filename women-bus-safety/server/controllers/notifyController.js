const sendNotification = async (_req, res) => {
  res.json({ success: true, message: "Notification endpoint reachable" });
};

module.exports = { sendNotification };
