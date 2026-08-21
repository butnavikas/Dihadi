const Work = require("../models/work");

//creating work
const addWork = async (req, res) => {
    try {

        const newWork = await Work.create({
            ...req.body,
            // Take creator ID from the verified JWT
            createdBy: req.user.id
        });

        return res.status(201).json(newWork);

    } catch (error) {

        console.error("Error creating work post:", error);

        return res.status(400).json({
            error: error.message
        });
    }
};


//this is for all works
const getAllWork = async (req, res) => {
    try {

        const { search } = req.query;

        let queryFilter = {};

        if (search && search.trim() !== "") {

            const searchRegex = new RegExp(search.trim(), "i");

            queryFilter = {
                $or: [
                    { title: searchRegex },
                    { details: searchRegex },
                    { owner_name: searchRegex },
                    { worker_type: searchRegex },
                    { address: searchRegex },
                    { city: searchRegex },
                    { state: searchRegex },
                    { pay: searchRegex }
                ]
            };
        }

        const works = await Work
            .find(queryFilter)
            .sort({ createdAt: -1 });

        return res.status(200).json(works);

    } catch (error) {

        console.error("Search error:", error);

        return res.status(500).json({
            error: error.message
        });
    }
};


// for single work

const getWorkById = async (req, res) => {
    try {

        const work = await Work.findById(req.params.id);

        if (!work) {
            return res.status(404).json({
                message: "Work posting not found"
            });
        }

        return res.status(200).json(work);

    } catch (error) {

        return res.status(500).json({
            error: "Invalid Work ID or server error"
        });
    }
};

//for editing the work
const editWork = async (req, res) => {
    try {

        const work = await Work.findById(req.params.id);

        if (!work) {
            return res.status(404).json({
                message: "Work posting not found"
            });
        }


        if (String(work.createdBy) !== String(req.user.id)) {

            return res.status(403).json({
                message: "You are not allowed to edit this posting"
            });
        }


        // Never allow frontend to change creator
        const updateData = { ...req.body };
        delete updateData.createdBy;


        const updatedWork = await Work.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                returnDocument: "after",
                runValidators: true
            }
        );


        return res.status(200).json({
            message: "Work posting updated successfully",
            work: updatedWork
        });

    } catch (error) {

        console.error("Edit error:", error);

        return res.status(500).json({
            error: error.message
        });
    }
};


//deleting work
const deleteWork = async (req, res) => {
    try {

        const work = await Work.findById(req.params.id);

        if (!work) {
            return res.status(404).json({
                message: "Work posting not found"
            });
        }


        if (String(work.createdBy) !== String(req.user.id)) {

            return res.status(403).json({
                message: "You are not allowed to delete this posting"
            });
        }


        await Work.findByIdAndDelete(req.params.id);


        return res.status(200).json({
            message: "Work posting deleted successfully"
        });

    } catch (error) {

        console.error("Delete error:", error);

        return res.status(500).json({
            error: error.message
        });
    }
};


module.exports = {
    addWork,
    getAllWork,
    getWorkById,
    editWork,
    deleteWork
};
