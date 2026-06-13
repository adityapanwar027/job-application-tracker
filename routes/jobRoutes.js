const express = require("express");
const { createJob, getJob, getJobStats,getSingleJob, updateJob, deleteJob } = require("../controllers/jobController");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, createJob);
router.get("/", protect, getJob);
router.get("/stats", protect, getJobStats);
router.get("/:id", protect, getSingleJob);
router.put("/:id", protect, updateJob);
router.delete("/:id", protect, deleteJob);

module.exports = router;