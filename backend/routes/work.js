const express = require("express");
const router = express.Router();

const {
    addWork,
    getAllWork,
    getWorkById,
    editWork,
    deleteWork
} = require("../controller/work");

const { protect } = require("../middleware/auth");

// Anyone can view works
router.get("/", getAllWork);
//if someone clicks the workcard it will directly go to its details
router.get("/:id", getWorkById);

// Login required to create
router.post("/add", protect, addWork);

// Login + ownership checked inside controller
router.put("/edit/:id", protect, editWork);
router.delete("/delete/:id", protect, deleteWork);

module.exports = router;