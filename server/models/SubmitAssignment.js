const mongoose = require('mongoose');

const submitAssignmentSchema = new mongoose.Schema({
    schoolId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'School'
    },
    class: {
        type: String,
        required: true,
    },
    section: {
        type: String,
        required: true,
        uppercase:true,
    },
    assignmentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Assignment'
    },
    submittedBy: [{
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Student'
        },
        assignmentWork: {
            type: String,
            required: true,
        },
    }]
}, { timestamps: true })
module.exports = mongoose.model('submitAssignment', submitAssignmentSchema);

