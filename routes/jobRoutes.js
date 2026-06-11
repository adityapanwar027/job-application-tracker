const express = require("express");
const { createJob, getJob } = require("../controllers/jobController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createJob);
router.get("/", protect, getJob);

module.exports = router;