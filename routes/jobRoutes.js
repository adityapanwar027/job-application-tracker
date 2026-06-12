const express = require("express");
const { createJob, getJob, updateJob, deleteJob } = require("../controllers/jobController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createJob);
router.get("/", protect, getJob);
router.put("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);

module.exports = router;