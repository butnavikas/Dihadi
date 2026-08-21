const mongoose = require("mongoose");

const jobSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    occupation: {
        type: String,
        required: true
    },

    details: {
        type: String
    },

    address: {
        type: String,
        required: true
    },

    city: {
        type: String,
        required: true
    },

    state: {
        type: String,
        required: true
    },

    phone_no: {
        type: String,
        required: true
    },

    pay: {
        type: String,
        required: true
    },

    // NEW
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);