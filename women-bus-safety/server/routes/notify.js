const express = require("express");
const { sendNotification } = require("../controllers/notifyController");

const router = express.Router();
router.post("/", sendNotification);

module.exports = router;
