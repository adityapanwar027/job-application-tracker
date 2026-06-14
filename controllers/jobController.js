const asyncHandler = require("express-async-handler");
const job = require("../models/Job");
const Job = require("../models/Job");
const { create } = require("../models/User");

// Create Job
const createJob = asyncHandler (async (req, res) => {
 
    const { company, position, status } = req.body;

   if (!company || !position) {
    return res.status(400).json({
        message: "Company and position are required",
    });
   }

   const validStatus = ["Applied", "Interview", "Rejected", "Offer"];
   if (status && !validStatus.includes(status)) {
     return res.status(400).json({
      message: "Invalid job status",
     });
   }

    const newJob = await Job.create({
      company,
      position,
      status,
      user: req.user.id,
    });

    res.status(201).json(newJob);
});

// Get Jobs
const getJob = asyncHandler (async (req, res) => {
  
    const { status, search } = req.query;

    let queryObject = {
      user: req.user.id,
    };

   let sortOption = {};
   if (req.query.sort === "latest") {
     sortOption = { createdAt: -1 };
   } else if (req.query.sort === "oldest") {
     sortOption = { createdAt: 1 };
   } else if (req.query.sort === "a-z") {
     sortOption = { createdAt: 1 };
   } else if (req.query.sort === "z-a") {
     sortOption = { createdAt: -1 };
   }

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
    .sort(sortOption)
    .skip(skip)
    .limit(limit);

    const totalJobs = await Job.countDocuments(queryObject);
    res.status(200).json({
      jobs,
      totalJobs,
      currentPage: page,
      totalPages: Math.ceil(totalJobs / limit),
    })  
});


// Get single job
const getSingleJob = asyncHandler (async ( req, res) => {
  
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
});

// Get job status
const getJobStats = asyncHandler (async ( req, res) => {
  
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
});

// Update Job
const updateJob = asyncHandler (async ( req, res) => {
  
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

});

// Delete Job
const deleteJob = asyncHandler (async ( req, res) => {
  
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
  
});

module.exports = {
  createJob,
  getJob,
  getSingleJob,
  getJobStats,
  updateJob,
  deleteJob,
};