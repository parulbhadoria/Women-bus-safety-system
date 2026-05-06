const express = require("express");
const { createSos } = require("../controllers/sosController");

const router = express.Router();
router.post("/", createSos);

module.exports = router;
