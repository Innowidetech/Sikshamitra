const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    assignmentName: {
        type: String,
        required:true,
    },
    teacherName: {
        type: String,
        required:true,
    },
    class: {
        type: String,
        required: true,
    },
    section: {
        type: String,
        required: true,
        uppercase:true
    },
    subject: {
        type: String,
        required: true,
    },
    chapter: {
        type: String,
        required: true,
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    assignment: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Teacher'
    },
}, { timestamps: true });
module.exports = mongoose.model('Assignment', assignmentSchema);