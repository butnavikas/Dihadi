const Job = require("../models/job");
//in navbar if the job profile is made then the btn add your job profile changes to  view
// your job profile so we need that the user has created the job profile or not

const isCreated = async (req, res, next) => {
  try {
    const existingJob = await Job.findOne({
      createdBy: req.user.id
    });

    if (existingJob) {
      return res.status(400).json({
        message: "You already have a job profile.",
        jobId: existingJob._id
      });
    }

    next();

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = isCreated;