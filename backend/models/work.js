const mongoose = require("mongoose");

const workSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },

    details: {
        type: String
    },

    owner_name: {
        type: String,
        required: true
    },

    worker_type: {
        type: String,
        required: true
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

    // The account that created this posting
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, { timestamps: true });

module.exports = mongoose.model("work", workSchema);