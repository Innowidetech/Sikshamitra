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
    subject: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    syllabus: {
        type: String,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Syllabus', syllabusSchema);