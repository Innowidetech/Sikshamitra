const mongoose = require('mongoose');

const SuperAdminStaffSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    name: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true
    },
    highestEducation: {
        degree: { type: String, required: true },
        university: { type: String, required: true },
        city: { type: String, required: true }
    },
    idProof: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('SuperAdminStaff', SuperAdminStaffSchema);