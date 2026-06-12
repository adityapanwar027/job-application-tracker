const express = require("express");
const { createJob, getJob, updateJob } = require("../controllers/jobController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createJob);
router.get("/", protect, getJob);
router.put("/:id", protect, updateJob);

module.exports = router;