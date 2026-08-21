const Job = require("../models/job");
//flow is like this models <- controller <- routes
// Create a new job/worker profile
const addJob = async (req, res) => {
  try {
    const newJob = await Job.create({
      ...req.body,
      createdBy :req.user.id
    });
    return res.status(201).json(newJob);
  } catch (error) {
    console.error("Error creating Job post:", error);
    return res.status(400).json({ error: error.message });
  }
};

// Get all jobs/workers with live search filtering
const getAllJob = async (req, res) => {
  try {
    const { search } = req.query;
    let queryFilter = {};

    if (search && search.trim() !== "") {
      const searchRegex = new RegExp(search.trim(), "i");

      queryFilter = {
                $or: [
                    { name: searchRegex },
                    { occupation: searchRegex },
                    { details: searchRegex },
                    { address: searchRegex },
                    { city: searchRegex },
                    { state: searchRegex },
                    { pay: searchRegex }
                ]
            };
    }

    const jobs = await Job.find(queryFilter).sort({ createdAt: -1 });
    return res.status(200).json(jobs);
  } catch (error) {
    console.error("Search error:",error);
    return res.status(500).json({ error: error.message });
  }
};

// Get single job/worker profile by ID
//if we click the card then its taken to pg where only that card details are shown
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job Profile not found" });
    }
    return res.status(200).json(job);
  } catch (error) {
    return res.status(500).json({ error: "Invalid Job ID or server error" });
  }
};

// Edit job/worker profile
const editJob = async (req, res) => {
  try {

    const job = await Job.findById(req.params.id);
   
    if (!job) {
      return res.status(404).json({ message: "Job Profile not found" });
    }

//checking that the user is owner of that card or not
      if(String(job.createdBy) != String(req.user.id)){
        return res.status(403).json({
          message:"You are not allowed to edit this job profile"
        });
      }
      //... is spread operator means copy all properties from req.body
    const updateData = {...req.body};
    delete updateData.createdBy;
    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      updateData,{ 
        returnDocument: "after", runValidators: true }
    );

    return res.status(200).json({
      message: "Job Profile updated successfully",
      Job: updatedJob
    });
  } catch (error) {
        console.error("Edit error:", error);
    return res.status(500).json({ error: error.message });
  }
};

// Delete job/worker profile
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job posting not found" });
    }
//ownership check
    if(String(job.createdBy) != String(req.user.id)){
        return res.status(403).json({
          message:"You are not allowed to delete this job profile"
        });
      }
    await Job.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Job Profile deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addJob,
  getAllJob,
  getJobById,
  editJob,
  deleteJob
};
