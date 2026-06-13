const job = require("../models/Job");
const Job = require("../models/Job");

// Create Job
const createJob = async (req, res) => {
  try {
    const { company, position, status } = req.body;

   if (!company || !position) {
    return res.status(400).json({
        message: "Company and position are required",
    });
   }

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

// Get Jobs
const getJob = async (req, res) => {
  try {
    const { status, search } = req.query;

    let queryObject = {
      user: req.user.id,
    };

    if (status) {
      queryObject.status = status;
    }

    if (search) {
      queryObject.$or = [
        { company: { $regex: search, $options: "i" } },
        { position: { $regex: search, $options: "i" } },
      ];
    }

    // const jobs = await Job.find(queryObject);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const jobs = await job.find(queryObject)
    .skip(skip)
    .limit(limit);

    const totalJobs = await Job.countDocuments(queryObject);
    res.status(200).json({
      jobs,
      totalJobs,
      currentPage: page,
      totalPages: Math.ceil(totalJobs / limit),
    })

// res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// Get single job
const getSingleJob = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.status(200).json(job);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get job status
const getJobStats = async (req, res) => {
  try {
    const jobs = await Job.find({
      user: req.user.id,
    });

    const stats = {
      Applied: 0,
      Interview: 0,
      Rejected: 0,
      Offer: 0,
    };

    jobs.forEach((job) => {
      stats[job.status]++;
    });

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Update Job
const updateJob = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Delete Job
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createJob,
  getJob,
  getSingleJob,
  getJobStats,
  updateJob,
  deleteJob,
};