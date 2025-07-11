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
    employeeRole: String,
    department: {
        type: String,
        required: true,
    },
    salary: {
        type: Number,
        required: true,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('SuperAdminStaff', SuperAdminStaffSchema);