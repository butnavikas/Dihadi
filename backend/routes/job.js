const express = require("express");
const router = express.Router();

const {
  addJob,
  getAllJob,
  getJobById,
  editJob,
  deleteJob
} = require("../controller/job");

const { protect } = require("../middleware/auth");
const Job = require("../models/job");
const isCreated = require("../middleware/isCreated");




// Get all jobs
router.get("/", getAllJob);



router.get("/my-job", protect, async (req, res) => {
  try {

    const job = await Job.findOne({
      createdBy: req.user.id
    });

    if (!job) {
      return res.status(404).json({
        message: "You have not created a job profile"
      });
    }

    res.status(200).json(job);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});

//creating job

router.post("/add", protect, isCreated, addJob);

//edit job

router.put("/edit/:id", protect, editJob);


//delete job

router.delete("/delete/:id", protect, deleteJob);

//get one job by id

router.get("/:id", getJobById);


module.exports = router;