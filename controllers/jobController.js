const Job = require("../models/job");

const createJob = async (req, res) => {
  try {
    const { company, position, status } = req.body;

    const newJob = await Job.create({
      company,
      position,
      status,
      user: req.user.id,
    });

    res.status(201).json(newJob);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getJob = async (req, res) => {
  try {
    const jobs = await Job.find({ user: req.user.id });

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { createJob, getJob };