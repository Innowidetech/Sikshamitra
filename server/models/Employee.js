const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'School',
    },
    name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
    },
    department: {
        type: String,
        required: true,
    },
    mobileNumber: {
        type: String,
        required:true,
    },
    salary:{
        type:Number,
        required:true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Employee', EmployeeSchema);