const mongoose = require('mongoose');

const submitAssignmentSchema = new mongoose.Schema({
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

