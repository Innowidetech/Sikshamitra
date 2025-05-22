const mongoose = require('mongoose');
const syllabusSchema = new mongoose.Schema({
    schoolId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'School',
    },
    class: {
        type: String,
        required: true,
    },
    syllabus: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
},
    { timestamps: true }
);

module.exports = mongoose.model('Syllabus', syllabusSchema);